from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


EXPIRATION_OPTIONS = {
    "never": None,
    "10min": 10,
    "1hour": 60,
    "1day": 1440,
    "1week": 10080,
}

SUPPORTED_LANGUAGES = [
    "python", "javascript", "java", "cpp", "ruby",
    "sql", "json", "html", "css", "plaintext"
]


class PasteCreate(BaseModel):
    title: str = "Untitled"
    content: str
    language: str = "plaintext"
    visibility: str = "public"
    expiration: str = "never"  # never, 10min, 1hour, 1day, 1week


class PasteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    language: Optional[str] = None
    visibility: Optional[str] = None
    expiration: Optional[str] = None


class PasteOwner(BaseModel):
    id: UUID
    username: str

    class Config:
        from_attributes = True


class PasteResponse(BaseModel):
    id: UUID
    short_id: str
    title: str
    content: str
    language: str
    visibility: str
    expires_at: Optional[datetime]
    user_id: Optional[UUID]
    owner: Optional[PasteOwner]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PasteListItem(BaseModel):
    id: UUID
    short_id: str
    title: str
    language: str
    visibility: str
    expires_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    owner: Optional[PasteOwner]

    class Config:
        from_attributes = True


class PaginatedPastes(BaseModel):
    pastes: list[PasteListItem]
    total: int
    page: int
    per_page: int
    total_pages: int
