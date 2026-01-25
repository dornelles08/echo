import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class Transcription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    filename: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "pending"
    prompt: Optional[str] = None
    transcription: Optional[str] = None

    class Config:
        validate_by_name = True


class PaginatedTranscriptions(BaseModel):
    total: int
    items: List[Transcription]


class TranscriptionSummary(BaseModel):
    id: str
    filename: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedTranscriptionSummary(BaseModel):
    total: int
    items: List[TranscriptionSummary]
