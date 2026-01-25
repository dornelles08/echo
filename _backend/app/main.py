from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database import connect_to_mongo, close_mongo_connection
from app.redis_client import connect_to_redis, close_redis_connection
from app.routers import transcriptions


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    await connect_to_redis()
    yield
    await close_mongo_connection()
    await close_redis_connection()

app = FastAPI(lifespan=lifespan)

app.include_router(transcriptions.router)
