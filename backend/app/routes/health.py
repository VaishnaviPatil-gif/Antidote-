"""GET /health — liveness + whether Gemini is configured."""

from __future__ import annotations

from fastapi import APIRouter

from .. import __version__
from ..config import settings
from ..models import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["meta"])
def health() -> HealthResponse:
    """Report service health. `gemini` is False in safe-fallback mode."""
    return HealthResponse(status="ok", gemini=settings.gemini_enabled, version=__version__)
