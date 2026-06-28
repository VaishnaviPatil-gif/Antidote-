"""POST /api/summarize — proxy the monitoring log to Gemini for a handover line.

Always returns a usable sentence: a Gemini-enhanced one when configured, or a
deterministic local fallback otherwise (te/hi/en-safe; English clinical text).
"""

from __future__ import annotations

import logging

from fastapi import APIRouter

from ..models import SummarizeRequest, SummarizeResponse
from ..services import gemini

logger = logging.getLogger("antidote.summarize")
router = APIRouter()


@router.post("/summarize", response_model=SummarizeResponse, tags=["ai"])
def summarize(req: SummarizeRequest) -> SummarizeResponse:
    """Summarise the symptom log into one clinician-facing sentence."""
    log = [e.model_dump() for e in req.symptomLog]
    result = gemini.summarize(log, req.biteTime, req.language or "en")
    return SummarizeResponse(**result)
