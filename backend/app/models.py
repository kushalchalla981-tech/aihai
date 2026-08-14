from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Literal, Optional, List
from uuid import UUID


class LogCreate(BaseModel):
    timestamp: datetime
    service: str = Field(..., max_length=100)
    level: str
    message: str
    raw_log: str
    metadata: Optional[dict] = {}

    @field_validator("level")
    @classmethod
    def validate_level(cls, v: str) -> str:
        v = v.upper()
        if v not in ("DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"):
            raise ValueError("Invalid log level")
        return v


class LogResponse(BaseModel):
    id: UUID
    timestamp: datetime
    service: Optional[str]
    level: str
    message: str
    raw_log: str
    template_id: Optional[int] = None
    parameters: Optional[list] = None
    metadata: dict = {}
    created_at: datetime


class LogBatchCreate(BaseModel):
    logs: List[LogCreate]


class LogUploadResponse(BaseModel):
    logs_processed: int
    logs_failed: int
    errors: List[str] = []


class IncidentCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    severity: str
    start_time: datetime
    affected_services: List[str] = []
    metadata: Optional[dict] = {}

    @field_validator("severity")
    @classmethod
    def validate_severity(cls, v: str) -> str:
        if v not in ("low", "medium", "high", "critical"):
            raise ValueError("Invalid severity")
        return v


class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    end_time: Optional[datetime] = None
    root_cause: Optional[str] = None
    resolution: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in ("open", "investigating", "resolved", "closed"):
            raise ValueError("Invalid status")
        return v


class IncidentResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    severity: str
    status: str
    start_time: datetime
    end_time: Optional[datetime]
    affected_services: List[str]
    root_cause: Optional[str]
    resolution: Optional[str]
    metadata: dict
    created_at: datetime
    updated_at: datetime


class AnomalyWindow(BaseModel):
    window_start: datetime
    window_end: datetime
    anomaly_score: float
    is_anomaly: bool
    total_logs: int
    error_count: int
    critical_count: int
    warning_count: int
    error_ratio: float
    unique_services: list[str]
    sample_log_ids: list[str]


class AnomalyDetectionResult(BaseModel):
    windows: list[AnomalyWindow]
    total_windows: int
    anomalous_windows: int
    contamination: float


class AnomalyDetectionRequest(BaseModel):
    service: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    window_minutes: int = Field(1, ge=1, le=1440)
    contamination: float = Field(0.1, ge=0.01, le=0.5)


class VectorSearchQuery(BaseModel):
    query: str
    limit: int = 20
    service: Optional[str] = None
    level: Optional[str] = None


class VectorSearchResultItem(BaseModel):
    id: UUID
    timestamp: datetime
    service: Optional[str]
    level: str
    message: str
    raw_log: str
    similarity: float


class VectorSearchResponse(BaseModel):
    results: list[VectorSearchResultItem]
    query: str
    total: int


class BackfillResponse(BaseModel):
    processed: int
    failed: int
    errors: list[str] = []


class HealthResponse(BaseModel):
    status: str
    database: str
    timestamp: datetime


ScanSeverity = Literal["critical", "high", "medium", "low"]
ScanStatus = Literal["queued", "running", "completed", "failed"]


class ScanCreate(BaseModel):
    repo_url: str = Field(..., min_length=1, max_length=2048)
    name: Optional[str] = Field(None, max_length=255)


class ScanFinding(BaseModel):
    id: UUID
    scan_id: UUID
    severity: ScanSeverity
    category: str                      # "secrets" | "code" | "config" | LLM category string
    rule_id: Optional[str] = None
    file: str
    line: Optional[int] = None
    evidence: str
    description: str
    remediation: Optional[str] = None
    promoted_to_incident: bool = False


class ScanRun(BaseModel):
    id: UUID
    repo_url: str
    name: Optional[str] = None
    status: ScanStatus
    score: Optional[float] = None
    grade: Optional[Literal["A", "B", "C", "D", "F"]] = None
    summary: Optional[str] = None
    error: Optional[str] = None
    total_files: int = 0
    metadata: dict = Field(default_factory=dict)
    finding_count: int = 0
    created_at: datetime
    updated_at: datetime


class ScanResponse(ScanRun):
    findings: list[ScanFinding] = Field(default_factory=list)
