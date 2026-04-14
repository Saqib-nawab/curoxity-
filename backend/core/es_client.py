from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

from elasticsearch import Elasticsearch

from core.config import settings


USER_INDEX_BODY: dict[str, Any] = {
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 1,
        "analysis": {
            "normalizer": {
                "lowercase_normalizer": {
                    "type": "custom",
                    "filter": ["lowercase", "asciifolding"],
                }
            }
        },
    },
    "mappings": {
        "dynamic": False,
        "properties": {
            "email": {
                "type": "keyword",
                "normalizer": "lowercase_normalizer",
            },
            "full_name": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256,
                    }
                },
            },
            "avatar_url": {
                "type": "keyword",
                "index": False,
            },
            "email_verified": {
                "type": "boolean",
            },
            "auth_provider": {
                "type": "keyword",
            },
            "password_hash": {
                "type": "keyword",
                "index": False,
            },
            "verification_token": {
                "type": "keyword",
                "index": False,
            },
            "verification_token_expires_at": {
                "type": "date",
            },
            "password_reset_token": {
                "type": "keyword",
                "index": False,
            },
            "password_reset_expires_at": {
                "type": "date",
            },
            "role": {
                "type": "keyword",
            },
            "status": {
                "type": "keyword",
            },
            "onboarding_completed": {
                "type": "boolean",
            },
            "onboarding_step": {
                "type": "keyword",
            },
            "daily_message_limit": {
                "type": "integer",
            },
            "daily_message_used": {
                "type": "integer",
            },
            "daily_message_reset_at": {
                "type": "date",
            },
            "last_login_at": {
                "type": "date",
            },
            "last_login_ip": {
                "type": "ip",
            },
            "created_at": {
                "type": "date",
            },
            "updated_at": {
                "type": "date",
            },
        },
    },
}


def _validate_ca_cert_path(ca_cert_path: str) -> str:
    path = Path(ca_cert_path).expanduser()

    if not path.exists():
        raise RuntimeError(f"ES_CA_CERT does not exist: {path}")

    if path.is_dir():
        raise RuntimeError(
            f"ES_CA_CERT must point to a certificate file, not a directory: {path}"
        )

    return str(path)


@lru_cache(maxsize=1)
def get_auth_es_client() -> Elasticsearch:
    kwargs: dict[str, Any] = {
        "hosts": [settings.es_url],
        "request_timeout": 30,
    }

    if settings.es_user and settings.es_pass:
        kwargs["basic_auth"] = (settings.es_user, settings.es_pass)

    if settings.es_ca_cert:
        kwargs["ca_certs"] = _validate_ca_cert_path(settings.es_ca_cert)
        kwargs["verify_certs"] = True
    else:
        kwargs["verify_certs"] = False

    return Elasticsearch(**kwargs)