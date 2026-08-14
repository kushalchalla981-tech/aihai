from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal


class Settings(BaseSettings):
    DATABASE_URL: str = ""
    OPENAI_API_KEY: str = ""
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    LOG_LEVEL: str = "INFO"
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: list[str] = ["*"]
    LLM_MODEL: str = "gpt-4o-mini"
    SCAN_TMP_DIR: str = "./.scan-tmp"
    MAX_REPO_SIZE_MB: int = 50
    MAX_SCAN_FILES: int = 2000
    MAX_LLM_FILES: int = 10
    MAX_LLM_FILE_CHARS: int = 12000
    MAX_LLM_INPUT_CHARS: int = 600000
    SCAN_ALLOWED_HOSTS: list[str] = ["github.com", "gitlab.com", "bitbucket.org"]
    SCAN_MAX_CONCURRENT: int = 2

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
