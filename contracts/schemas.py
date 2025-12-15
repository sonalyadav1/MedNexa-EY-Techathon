from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime


class QueryInput(BaseModel):
    query: str = Field(..., description="User's natural language query")


class ExtractedEntities(BaseModel):
    drug_name: Optional[str] = Field(None, description="Extracted drug name")
    therapeutic_area: Optional[str] = Field(None, description="Therapeutic area")
    regions: List[str] = Field(default_factory=list, description="Target regions")
    timeframe: Optional[str] = Field(None, description="Analysis timeframe")


class QueryContext(BaseModel):
    original_query: str
    extracted_entities: ExtractedEntities
    required_agents: List[str]


class PrescriptionTrend(BaseModel):
    year: int
    prescriptions: int


class IQVIAData(BaseModel):
    market_size_usd: int
    growth_rate_cagr: float
    prescription_trends: List[PrescriptionTrend]
    competitor_share: Dict[str, float]


class EXIMData(BaseModel):
    import_volume_kg: int
    export_volume_kg: int
    top_exporters: List[str]
    tariff_impact_pct: float
    trade_barriers: List[str]


class ExpiringPatent(BaseModel):
    patent_id: str
    expiry_date: str


class PatentData(BaseModel):
    active_patents: int
    expiring_soon: List[ExpiringPatent]
    competitor_filings: int
    exclusivity_window_years: int


class PhaseDistribution(BaseModel):
    phase_1: int
    phase_2: int
    phase_3: int
    phase_4: int


class ClinicalTrialsData(BaseModel):
    total_trials: int
    phase_distribution: PhaseDistribution
    completion_rate: float
    competitive_trials: int


class InternalKnowledgeData(BaseModel):
    rd_budget_usd: int
    manufacturing_capacity_units_per_year: int
    forecast_revenue_2025_usd: int
    strategic_priority: str


class WebIntelligenceData(BaseModel):
    sentiment_score: float
    news_mentions: int
    regulatory_updates: List[str]
    market_rumors: List[str]


class AgentOutput(BaseModel):
    agent: str
    data: Dict[str, Any]
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())


class AggregatedData(BaseModel):
    query_context: Dict[str, Any]
    worker_results: Dict[str, Any]
    aggregation_timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())


class GeminiOutput(BaseModel):
    summary: str
    gemini_model: str = "gemini-1.5-pro"
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
