import os

from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/whisper_db")
REDIS_URI = os.getenv("REDIS_URI", "redis://localhost:6379/0")
REDIS_TRANSCRIPTION_QUEUE = os.getenv(
    "REDIS_TRANSCRIPTION_QUEUE", "media_transcription_queue"
)
REDIS_CONVERSION_QUEUE = os.getenv("REDIS_CONVERSION_QUEUE", "media_conversion_queue")

MODEL_NAME = os.getenv("MODEL_NAME", "medium")
SLEEP_TIME = int(os.getenv("SLEEP_TIME", "1"))

# MinIO/S3 Configuration
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL")
S3_ACCESS_KEY_ID = os.getenv("S3_ACCESS_KEY_ID")
S3_SECRET_ACCESS_KEY = os.getenv("S3_SECRET_ACCESS_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
S3_REGION = os.getenv("S3_REGION", "us-east-1")
