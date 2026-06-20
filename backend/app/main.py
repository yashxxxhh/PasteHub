from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database.session import engine
from app.models import user, paste
from app.routers import auth, pastes, dashboard


def create_tables():
    user.Base.metadata.create_all(bind=engine)
    paste.Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(
    title="PasteHub API",
    description="Code and text snippet sharing platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(pastes.router, prefix="/api", tags=["pastes"])
app.include_router(dashboard.router, prefix="/api", tags=["dashboard"])


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "PasteHub API"}
