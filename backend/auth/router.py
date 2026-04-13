from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from auth.schemas import AuthResponse, MessageResponse, SigninRequest, SignupRequest, UserPublic
from auth.service import AuthService
from core.config import settings
from core.es_client import get_auth_es_client

router = APIRouter()
bearer_scheme = HTTPBearer(auto_error=False)


def get_auth_service() -> AuthService:
    return AuthService(get_auth_es_client(), settings.es_users_index)


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, service: AuthService = Depends(get_auth_service)):
    return service.signup(payload)


@router.post("/signin", response_model=AuthResponse)
def signin(
    payload: SigninRequest,
    request: Request,
    service: AuthService = Depends(get_auth_service),
):
    client_ip = request.client.host if request.client else None
    return service.signin(payload, client_ip=client_ip)


@router.get("/me", response_model=UserPublic)
def me(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    service: AuthService = Depends(get_auth_service),
):
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated.",
        )

    return service.get_current_user(credentials.credentials)


@router.post("/signout", response_model=MessageResponse)
def signout():
    return MessageResponse(detail="Signed out successfully.")