from motor.motor_asyncio import AsyncIOMotorClient

from .config import settings

client: AsyncIOMotorClient = None


def get_db():
    return client[settings.MONGO_DB_NAME]


async def connect_to_mongo():
    global client
    client = AsyncIOMotorClient(settings.MONGO_URI)


async def close_mongo_connection():
    global client
    client.close()
