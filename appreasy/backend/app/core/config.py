from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://appreasy:appreasy@db:5432/appreasy"
    app_secret: str = "changeme"
    
    class Config:
        env_file = ".env"

settings = Settings()
