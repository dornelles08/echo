import os

from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/whisper_db")
REDIS_URI = os.getenv("REDIS_URI", "redis://localhost:6379/0")
MODEL_NAME = os.getenv("MODEL_NAME", "medium")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "../uploads")
REDIS_QUEUE = os.getenv("REDIS_QUEUE", "media_transcription_queue")
REDIS_PROCESSING_QUEUE = os.getenv(
    "REDIS_PROCESSING_QUEUE", "media_transcription_processing_queue"
)
SLEEP_TIME = int(os.getenv("SLEEP_TIME", "1"))
