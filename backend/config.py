from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    MONGODB_URI: str = Field(default="mongodb://localhost:27017/remindme")
    PORT: int = Field(default=8000)
    APP_ENV: str = Field(default="development")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()