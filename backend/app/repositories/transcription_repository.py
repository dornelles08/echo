from motor.motor_asyncio import AsyncIOMotorDatabase
from redis.asyncio import Redis
from app.models import Transcription
from app.config import settings


class TranscriptionRepository:
    def __init__(self, db: AsyncIOMotorDatabase, redis: Redis):
        self.db = db
        self.redis = redis
        self.collection = self.db.transcriptions

    async def create(self, transcription: Transcription) -> Transcription:
        await self.collection.insert_one(transcription.dict(by_alias=True))
        await self.redis.lpush(settings.REDIS_QUEUE_NAME, transcription.id)
        return transcription

    async def list(self, skip: int = 0, limit: int = 20) -> tuple[int, list[Transcription]]:
        projection = {
            "_id": 1,
            "filename": 1,
            "status": 1,
            "created_at": 1,
        }
        cursor = (
            self.collection.find({}, projection)
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        total = await self.collection.count_documents({})
        results = await cursor.to_list(length=limit)
        return total, [Transcription(**doc) for doc in results]

    async def get(self, task_id: str) -> Transcription | None:
        doc = await self.collection.find_one({"_id": task_id})
        return Transcription(**doc) if doc else None

    async def delete(self, task_id: str) -> bool:
        doc = await self.get(task_id)
        if not doc:
            return False

        if doc.status == "pending":
            await self.redis.lrem(settings.REDIS_QUEUE_NAME, 0, task_id)

        delete_result = await self.collection.delete_one({"_id": task_id})
        return delete_result.deleted_count > 0

    def get_collection(self):
        return self.collection

    def get_redis_client(self):
        return self.redis
