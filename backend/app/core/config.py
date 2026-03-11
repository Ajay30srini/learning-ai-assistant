from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    APP_NAME: str = "AI Learning Assistant"
    DB_URL: str = "sqlite+aiosqlite:///./app.db"
    UPLOAD_DIR: str = "app/storage/uploads"
    FAISS_DIR: str = "app/storage/faiss_index"
    TOP_K: int = 3
    CHUNK_SIZE: int = 900
    CHUNK_OVERLAP: int = 150
    OPENAI_MODEL: str = "gpt-4.1-mini"

    class Config:
        env_file = ".env"

settings = Settings()