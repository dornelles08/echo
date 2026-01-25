import os
import uuid
from fastapi import UploadFile
from app.repositories.transcription_repository import TranscriptionRepository
from app.models import Transcription, PaginatedTranscriptions
from app.config import settings


class TranscriptionService:
    def __init__(self, repository: TranscriptionRepository):
        self.repository = repository

    async def create_transcription_task(self, file: UploadFile, prompt: str | None) -> Transcription:
        task_id = str(uuid.uuid4())
        file_path = os.path.join(settings.UPLOAD_DIR, f"{task_id}_{file.filename}")

        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

        with open(file_path, "wb") as f:
            f.write(await file.read())

        transcription = Transcription(
            _id=task_id,
            filename=file.filename,
            prompt=prompt
        )

        return await self.repository.create(transcription)

    async def list_transcriptions(self, skip: int, limit: int) -> PaginatedTranscriptions:
        total, items = await self.repository.list(skip, limit)
        return PaginatedTranscriptions(total=total, items=items)

    async def get_transcription(self, task_id: str) -> Transcription | None:
        return await self.repository.get(task_id)

    async def delete_transcription(self, task_id: str) -> bool:
        transcription = await self.repository.get(task_id)
        if not transcription:
            return False

        deleted = await self.repository.delete(task_id)
        if deleted:
            file_path = os.path.join(settings.UPLOAD_DIR, f"{transcription.id}_{transcription.filename}")
            if os.path.exists(file_path):
                os.remove(file_path)
        return deleted

    def get_repository(self) -> TranscriptionRepository:
        return self.repository
