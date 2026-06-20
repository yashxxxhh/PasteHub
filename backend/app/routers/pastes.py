from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
import math

from app.database.session import get_db
from app.models.paste import Paste
from app.models.user import User
from app.schemas.paste import PasteCreate, PasteUpdate, PasteResponse, PasteListItem, PaginatedPastes
from app.auth.jwt import get_current_user, get_optional_user
from app.utils.helpers import generate_short_id, compute_expiry, is_expired

router = APIRouter()


def check_paste_access(paste: Paste, current_user: Optional[User]) -> bool:
    """Returns True if user can view this paste."""
    if paste.visibility == "public" or paste.visibility == "unlisted":
        return True
    if paste.visibility == "private":
        return current_user is not None and str(paste.user_id) == str(current_user.id)
    return False


@router.post("/pastes", response_model=PasteResponse, status_code=status.HTTP_201_CREATED)
def create_paste(
    payload: PasteCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    # Generate a unique short_id
    for _ in range(5):
        short_id = generate_short_id()
        if not db.query(Paste).filter(Paste.short_id == short_id).first():
            break

    paste = Paste(
        short_id=short_id,
        title=payload.title or "Untitled",
        content=payload.content,
        language=payload.language,
        visibility=payload.visibility,
        expires_at=compute_expiry(payload.expiration),
        user_id=current_user.id if current_user else None,
    )
    db.add(paste)
    db.commit()
    db.refresh(paste)
    return paste


@router.get("/pastes", response_model=PaginatedPastes)
def list_pastes(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    sort: str = Query("latest"),  # latest | oldest
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    query = db.query(Paste).filter(Paste.visibility == "public")

    if search:
        query = query.filter(Paste.title.ilike(f"%{search}%"))

    if language:
        query = query.filter(Paste.language == language)

    if sort == "oldest":
        query = query.order_by(Paste.created_at.asc())
    else:
        query = query.order_by(Paste.created_at.desc())

    total = query.count()
    pastes = query.offset((page - 1) * per_page).limit(per_page).all()

    # Filter expired pastes
    active_pastes = [p for p in pastes if not is_expired(p.expires_at)]

    return PaginatedPastes(
        pastes=active_pastes,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=math.ceil(total / per_page) if total > 0 else 1,
    )


@router.get("/pastes/{short_id}", response_model=PasteResponse)
def get_paste(
    short_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    paste = db.query(Paste).filter(Paste.short_id == short_id).first()

    if not paste:
        raise HTTPException(status_code=404, detail="Paste not found")

    if is_expired(paste.expires_at):
        raise HTTPException(status_code=410, detail="This paste has expired")

    if not check_paste_access(paste, current_user):
        raise HTTPException(status_code=403, detail="This paste is private")

    return paste


@router.put("/pastes/{short_id}", response_model=PasteResponse)
def update_paste(
    short_id: str,
    payload: PasteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    paste = db.query(Paste).filter(Paste.short_id == short_id).first()

    if not paste:
        raise HTTPException(status_code=404, detail="Paste not found")

    if str(paste.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="You don't own this paste")

    if payload.title is not None:
        paste.title = payload.title
    if payload.content is not None:
        paste.content = payload.content
    if payload.language is not None:
        paste.language = payload.language
    if payload.visibility is not None:
        paste.visibility = payload.visibility
    if payload.expiration is not None:
        paste.expires_at = compute_expiry(payload.expiration)

    db.commit()
    db.refresh(paste)
    return paste


@router.delete("/pastes/{short_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_paste(
    short_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    paste = db.query(Paste).filter(Paste.short_id == short_id).first()

    if not paste:
        raise HTTPException(status_code=404, detail="Paste not found")

    if str(paste.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="You don't own this paste")

    db.delete(paste)
    db.commit()


@router.post("/pastes/{short_id}/duplicate", response_model=PasteResponse, status_code=201)
def duplicate_paste(
    short_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    original = db.query(Paste).filter(Paste.short_id == short_id).first()

    if not original:
        raise HTTPException(status_code=404, detail="Paste not found")

    if not check_paste_access(original, current_user):
        raise HTTPException(status_code=403, detail="Cannot duplicate a private paste")

    new_short_id = generate_short_id()
    duplicate = Paste(
        short_id=new_short_id,
        title=f"Copy of {original.title}",
        content=original.content,
        language=original.language,
        visibility="public",
        expires_at=None,
        user_id=current_user.id if current_user else None,
    )
    db.add(duplicate)
    db.commit()
    db.refresh(duplicate)
    return duplicate
