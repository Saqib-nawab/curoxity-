from datetime import UTC, datetime, timedelta

from elasticsearch import Elasticsearch, NotFoundError
from fastapi import HTTPException, status

from auth.schemas import AuthResponse, SigninRequest, SignupRequest, UserPublic
from core.security import create_access_token, decode_access_token, hash_password, verify_password


class AuthService:
    def __init__(self, es: Elasticsearch, index_name: str) -> None:
        self.es = es
        self.index_name = index_name

    @staticmethod
    def _now() -> datetime:
        return datetime.now(UTC)

    @staticmethod
    def _now_iso() -> str:
        return datetime.now(UTC).isoformat()

    @staticmethod
    def _normalize_email(email: str) -> str:
        return email.strip().lower()

    def _get_user_hit_by_email(self, email: str) -> dict | None:
        normalized_email = self._normalize_email(email)

        response = self.es.search(
            index=self.index_name,
            size=1,
            query={"term": {"email": normalized_email}},
        )
        hits = response.get("hits", {}).get("hits", [])
        return hits[0] if hits else None

    def _get_user_hit_by_id(self, user_id: str) -> dict | None:
        try:
            response = self.es.get(index=self.index_name, id=user_id)
            return {"_id": response["_id"], "_source": response["_source"]}
        except NotFoundError:
            return None

    def _serialize_user(self, hit: dict) -> UserPublic:
        source = hit["_source"]

        return UserPublic(
            user_id=hit["_id"],
            email=source["email"],
            full_name=source.get("full_name", ""),
            email_verified=bool(source.get("email_verified", False)),
            auth_provider=source.get("auth_provider", "password"),
            role=source.get("role", "user"),
            status=source.get("status", "active"),
            onboarding_completed=bool(source.get("onboarding_completed", False)),
            onboarding_step=source.get("onboarding_step", "start"),
            daily_message_limit=int(source.get("daily_message_limit", 10)),
            daily_message_used=int(source.get("daily_message_used", 0)),
            daily_message_reset_at=source["daily_message_reset_at"],
            last_login_at=source.get("last_login_at"),
            created_at=source["created_at"],
            updated_at=source["updated_at"],
        )

    def signup(self, payload: SignupRequest) -> AuthResponse:
        existing_user = self._get_user_hit_by_email(payload.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )

        now = self._now()
        next_midnight = (now + timedelta(days=1)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )

        document = {
            "email": self._normalize_email(payload.email),
            "full_name": payload.full_name.strip(),
            "avatar_url": None,
            "email_verified": False,
            "auth_provider": "password",
            "password_hash": hash_password(payload.password),
            "verification_token": None,
            "verification_token_expires_at": None,
            "password_reset_token": None,
            "password_reset_expires_at": None,
            "role": "user",
            "status": "pending_verification",
            "onboarding_completed": False,
            "onboarding_step": "start",
            "daily_message_limit": 10,
            "daily_message_used": 0,
            "daily_message_reset_at": next_midnight.isoformat(),
            "last_login_at": now.isoformat(),
            "last_login_ip": None,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
        }

        create_response = self.es.index(
            index=self.index_name,
            document=document,
            refresh="wait_for",
        )

        user_id = create_response["_id"]
        created_hit = self._get_user_hit_by_id(user_id)
        if not created_hit:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="User was created but could not be fetched.",
            )

        user = self._serialize_user(created_hit)
        access_token = create_access_token(user_id=user.user_id, email=user.email)

        return AuthResponse(access_token=access_token, user=user)

    def signin(self, payload: SigninRequest, client_ip: str | None = None) -> AuthResponse:
        hit = self._get_user_hit_by_email(payload.email)
        if not hit:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        source = hit["_source"]
        auth_provider = source.get("auth_provider", "password")
        if auth_provider != "password":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"This account uses {auth_provider} sign-in.",
            )

        password_hash_value = source.get("password_hash")
        if not password_hash_value or not verify_password(payload.password, password_hash_value):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        user_id = hit["_id"]
        now_iso = self._now_iso()

        self.es.update(
            index=self.index_name,
            id=user_id,
            doc={
                "last_login_at": now_iso,
                "last_login_ip": client_ip,
                "updated_at": now_iso,
            },
            refresh="wait_for",
        )

        updated_hit = self._get_user_hit_by_id(user_id)
        if not updated_hit:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not fetch signed-in user.",
            )

        user = self._serialize_user(updated_hit)
        access_token = create_access_token(user_id=user.user_id, email=user.email)

        return AuthResponse(access_token=access_token, user=user)

    def get_current_user(self, token: str) -> UserPublic:
        try:
            payload = decode_access_token(token)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token.",
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload.",
            )

        hit = self._get_user_hit_by_id(user_id)
        if not hit:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found.",
            )

        return self._serialize_user(hit)