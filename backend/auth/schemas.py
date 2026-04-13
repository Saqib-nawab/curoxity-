from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class SigninRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)


class UserPublic(BaseModel):
    user_id: str
    email: EmailStr
    full_name: str
    email_verified: bool
    auth_provider: str
    role: str
    status: str
    onboarding_completed: bool
    onboarding_step: str
    daily_message_limit: int
    daily_message_used: int
    daily_message_reset_at: datetime
    last_login_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class MessageResponse(BaseModel):
    detail: str