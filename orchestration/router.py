from typing import List


IQVIA_KEYWORDS = ["market", "sales", "revenue", "prescription", "prescriptions", "market size", "growth"]
EXIM_KEYWORDS = ["import", "export", "trade", "tariff", "tariffs", "trading", "exim"]
PATENT_KEYWORDS = ["patent", "patents", "exclusivity", "ip", "expiration", "expiring", "intellectual property"]
CLINICAL_KEYWORDS = ["clinical", "trial", "trials", "pipeline", "phase", "phases", "study", "studies"]
INTERNAL_KEYWORDS = ["internal", "budget", "capacity", "forecast", "manufacturing", "rd", "r&d"]
WEB_KEYWORDS = ["news", "sentiment", "regulatory", "competitor", "competitors", "intelligence", "rumors"]

ALL_AGENTS = ["iqvia", "exim", "patent", "clinical_trials", "internal_knowledge", "web_intelligence"]


def route_query(query: str) -> List[str]:
    query_lower = query.lower()
    selected_agents = []
    
    if any(keyword in query_lower for keyword in IQVIA_KEYWORDS):
        selected_agents.append("iqvia")
    
    if any(keyword in query_lower for keyword in EXIM_KEYWORDS):
        selected_agents.append("exim")
    
    if any(keyword in query_lower for keyword in PATENT_KEYWORDS):
        selected_agents.append("patent")
    
    if any(keyword in query_lower for keyword in CLINICAL_KEYWORDS):
        selected_agents.append("clinical_trials")
    
    if any(keyword in query_lower for keyword in INTERNAL_KEYWORDS):
        selected_agents.append("internal_knowledge")
    
    if any(keyword in query_lower for keyword in WEB_KEYWORDS):
        selected_agents.append("web_intelligence")
    
    if not selected_agents:
        return ALL_AGENTS
    
    return selected_agents
