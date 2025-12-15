from typing import TypedDict, List, Dict, Any, Optional


class AgentState(TypedDict):
    user_query: str
    query_context: Dict[str, Any]
    selected_agents: List[str]
    worker_results: Dict[str, Any]
    aggregated_data: Dict[str, Any]
    summary: str
    pdf_path: str
    error: Optional[str]
