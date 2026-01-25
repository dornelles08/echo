from pydantic import AnyUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env"), extra="ignore")

    MONGO_URI: str
    REDIS_URI: str
    UPLOAD_DIR: str = "../uploads"
    MONGO_DB_NAME: str = "whisper_db"
    REDIS_QUEUE_NAME: str = "whisper_queue"

    @field_validator("MONGO_URI", "REDIS_URI", mode="after")
    def to_string(cls, v: AnyUrl):
        return str(v)


settings = Settings()
