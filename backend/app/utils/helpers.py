import random
import string
from datetime import datetime, timedelta, timezone
from typing import Optional


def generate_short_id(length: int = 8) -> str:
    """Generate a random alphanumeric short ID for paste URLs."""
    chars = string.ascii_letters + string.digits
    return "".join(random.choices(chars, k=length))


def compute_expiry(expiration: str) -> Optional[datetime]:
    """Convert expiration string to absolute datetime."""
    mapping = {
        "never": None,
        "10min": timedelta(minutes=10),
        "1hour": timedelta(hours=1),
        "1day": timedelta(days=1),
        "1week": timedelta(weeks=1),
    }
    delta = mapping.get(expiration)
    if delta is None:
        return None
    return datetime.now(timezone.utc) + delta


def is_expired(expires_at: Optional[datetime]) -> bool:
    """Check if a paste has expired."""
    if expires_at is None:
        return False
    return datetime.now(timezone.utc) > expires_at.replace(tzinfo=timezone.utc)
