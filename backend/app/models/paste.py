from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.database.session import Base


class VisibilityEnum(str, enum.Enum):
    public = "public"
    private = "private"
    unlisted = "unlisted"


class LanguageEnum(str, enum.Enum):
    python = "python"
    javascript = "javascript"
    java = "java"
    cpp = "cpp"
    ruby = "ruby"
    sql = "sql"
    json = "json"
    html = "html"
    css = "css"
    plaintext = "plaintext"


class Paste(Base):
    __tablename__ = "pastes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    short_id = Column(String(12), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False, default="Untitled")
    content = Column(Text, nullable=False)
    language = Column(String(50), nullable=False, default="plaintext")
    visibility = Column(String(20), nullable=False, default="public")
    expires_at = Column(DateTime(timezone=True), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    owner = relationship("User", back_populates="pastes")
