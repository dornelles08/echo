import redis.asyncio as redis
from .config import settings

redis_client: redis.Redis = None


def get_redis():
    return redis_client


async def connect_to_redis():
    global redis_client
    redis_client = redis.from_url(settings.REDIS_URI)


async def close_redis_connection():
    global redis_client
    await redis_client.close()
