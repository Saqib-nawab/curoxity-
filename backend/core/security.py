from datetime import UTC, datetime, timedelta

import bcrypt
from jose import JWTError, jwt

from core.config import settings


# ── Password helpers ──────────────────────────────────────────────────────────

def _truncate_password_to_72_bytes(password: str) -> bytes:
    """
    Truncate a UTF-8 password to at most 72 bytes at a valid character
    boundary, then return as bytes ready for bcrypt.
    """
    encoded = password.encode("utf-8")
    if len(encoded) <= 72:
        return encoded

    # Walk characters to find the safe cut point
    total = 0
    for i, char in enumerate(password):
        char_len = len(char.encode("utf-8"))
        if total + char_len > 72:
            return password[:i].encode("utf-8")
        total += char_len

    return encoded[:72]


def hash_password(password: str) -> str:
    pw_bytes = _truncate_password_to_72_bytes(password)
    hashed = bcrypt.hashpw(pw_bytes, bcrypt.gensalt(rounds=12))
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    pw_bytes = _truncate_password_to_72_bytes(plain_password)
    try:
        return bcrypt.checkpw(pw_bytes, hashed_password.encode("utf-8"))
    except Exception:
        return False


# ── JWT helpers ───────────────────────────────────────────────────────────────

def create_access_token(user_id: str, email: str) -> str:
    expires_at = datetime.now(UTC) + timedelta(
        minutes=settings.auth_access_token_expire_minutes
    )
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expires_at,
    }
    return jwt.encode(
        payload, settings.auth_secret_key, algorithm=settings.auth_algorithm
    )


def decode_access_token(token: str) -> dict:
    return jwt.decode(
        token,
        settings.auth_secret_key,
        algorithms=[settings.auth_algorithm],
    )


def safe_decode_access_token(token: str) -> dict | None:
    try:
        return decode_access_token(token)
    except JWTError:
        return None