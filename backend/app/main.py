from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import get_db
from app.api.v1.routes import health, logs, incidents, anomalies, search, scans
from app.services.parser import get_miner
from app.services.scanner import sweep_orphaned_scans


@asynccontextmanager
async def lifespan(app: FastAPI):
    db = await get_db()
    await sweep_orphaned_scans(db)
    get_miner()
    yield
    await db.close()


app = FastAPI(
    title="AI Incident Copilot",
    description="Intelligent incident management for small software teams",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(logs.router, prefix=settings.API_V1_PREFIX, tags=["logs"])
app.include_router(incidents.router, prefix=settings.API_V1_PREFIX, tags=["incidents"])
app.include_router(anomalies.router, prefix=settings.API_V1_PREFIX, tags=["anomalies"])
app.include_router(search.router, prefix=settings.API_V1_PREFIX, tags=["search"])
app.include_router(scans.router, prefix=settings.API_V1_PREFIX, tags=["scans"])
