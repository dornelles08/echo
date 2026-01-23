from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, HTTPException, status
from app.services.transcription_service import TranscriptionService
from app.models import Transcription, PaginatedTranscriptions, PaginatedTranscriptionSummary
from app.database import get_db
from app.redis_client import get_redis
from app.repositories.transcription_repository import TranscriptionRepository

router = APIRouter()


def get_transcription_repository(db=Depends(get_db), redis=Depends(get_redis)):
    return TranscriptionRepository(db, redis)


def get_transcription_service(repo: TranscriptionRepository = Depends(get_transcription_repository)):
    return TranscriptionService(repo)


@router.post("/transcribe", response_model=Transcription)
async def create_transcription(
    file: UploadFile = File(...),
    prompt: str = Form(None),
    service: TranscriptionService = Depends(get_transcription_service)
):
    return await service.create_transcription_task(file, prompt)


@router.get("/transcriptions", response_model=PaginatedTranscriptionSummary)
async def list_transcriptions(
    skip: int = 0,
    limit: int = Query(default=20, le=100),
    service: TranscriptionService = Depends(get_transcription_service)
):
    return await service.list_transcriptions(skip, limit)


@router.get("/transcriptions/{task_id}", response_model=Transcription)
async def get_transcription(
    task_id: str,
    service: TranscriptionService = Depends(get_transcription_service)
):
    transcription = await service.get_transcription(task_id)
    if not transcription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transcription not found")
    return transcription


@router.delete("/transcriptions/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transcription(
    task_id: str,
    service: TranscriptionService = Depends(get_transcription_service)
):
    deleted = await service.delete_transcription(task_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transcription not found")
    return None
