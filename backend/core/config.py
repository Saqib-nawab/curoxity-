from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    es_url: str = os.getenv("ES_URL")
    es_user: str = os.getenv("ES_USER")
    es_pass: str = os.getenv("ES_PASS")
    es_ca_cert: str = os.getenv("ES_CA_CERT")
    es_users_index: str = os.getenv("ES_USERS_INDEX")

    auth_secret_key: str = os.getenv("AUTH_SECRET_KEY")
    auth_algorithm: str = os.getenv("AUTH_ALGORITHM")
    auth_access_token_expire_minutes: int = int(
        os.getenv("AUTH_ACCESS_TOKEN_EXPIRE_MINUTES")
    )

    frontend_origin: str = os.getenv("FRONTEND_ORIGIN")


settings = Settings()