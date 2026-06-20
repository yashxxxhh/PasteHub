from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.database.session import get_db
from app.models.paste import Paste
from app.models.user import User
from app.schemas.paste import PasteListItem
from app.auth.jwt import get_current_user
from app.utils.helpers import is_expired

router = APIRouter()


class DashboardStats(BaseModel):
    total_pastes: int
    public_pastes: int
    private_pastes: int
    unlisted_pastes: int
    recently_created: list[PasteListItem]
    recently_updated: list[PasteListItem]


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_pastes = db.query(Paste).filter(Paste.user_id == current_user.id)

    total = user_pastes.count()
    public = user_pastes.filter(Paste.visibility == "public").count()
    private = user_pastes.filter(Paste.visibility == "private").count()
    unlisted = user_pastes.filter(Paste.visibility == "unlisted").count()

    recently_created = (
        user_pastes.order_by(Paste.created_at.desc()).limit(5).all()
    )
    recently_updated = (
        user_pastes.order_by(Paste.updated_at.desc()).limit(5).all()
    )

    return DashboardStats(
        total_pastes=total,
        public_pastes=public,
        private_pastes=private,
        unlisted_pastes=unlisted,
        recently_created=recently_created,
        recently_updated=recently_updated,
    )


@router.get("/my-pastes", response_model=list[PasteListItem])
def get_my_pastes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pastes = (
        db.query(Paste)
        .filter(Paste.user_id == current_user.id)
        .order_by(Paste.created_at.desc())
        .all()
    )
    return [p for p in pastes if not is_expired(p.expires_at)]
