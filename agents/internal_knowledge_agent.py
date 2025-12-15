import json
from typing import Dict, Any
from pathlib import Path
from contracts.schemas import AgentOutput


DATA_FILE = Path(__file__).parent.parent / "data" / "internal_knowledge.json"


def load_internal_data() -> Dict[str, Any]:
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def process(query_context: Dict[str, Any]) -> Dict[str, Any]:
    entities = query_context.get("extracted_entities", {})
    drug_name = entities.get("drug_name", "Drug X")
    
    raw_data = load_internal_data()
    
    drug_data = None
    for drug in raw_data.get("drugs", []):
        if drug.get("name", "").lower() == drug_name.lower():
            drug_data = drug
            break
    
    if not drug_data:
        drug_data = raw_data["drugs"][0] if raw_data.get("drugs") else {}
    
    output = AgentOutput(
        agent="internal_knowledge",
        data={
            "rd_budget_usd": drug_data.get("rd_budget", 0),
            "manufacturing_capacity_units_per_year": drug_data.get("capacity_units", 0),
            "forecast_revenue_2025_usd": drug_data.get("forecast_2025", 0),
            "strategic_priority": drug_data.get("priority", "medium")
        }
    )
    
    return output.model_dump()
