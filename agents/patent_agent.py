import json
from typing import Dict, Any
from pathlib import Path
from contracts.schemas import AgentOutput


DATA_FILE = Path(__file__).parent.parent / "data" / "patent_data.json"


def load_patent_data() -> Dict[str, Any]:
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def process(query_context: Dict[str, Any]) -> Dict[str, Any]:
    entities = query_context.get("extracted_entities", {})
    drug_name = entities.get("drug_name", "Drug X")
    
    raw_data = load_patent_data()
    
    drug_data = None
    for drug in raw_data.get("drugs", []):
        if drug.get("name", "").lower() == drug_name.lower():
            drug_data = drug
            break
    
    if not drug_data:
        drug_data = raw_data["drugs"][0] if raw_data.get("drugs") else {}
    
    expiring_patents = [
        {"patent_id": p["id"], "expiry_date": p["expiry"]}
        for p in drug_data.get("expiring_patents", [])
    ]
    
    output = AgentOutput(
        agent="patent",
        data={
            "active_patents": drug_data.get("active_patents", 0),
            "expiring_soon": expiring_patents,
            "competitor_filings": drug_data.get("competitor_filings", 0),
            "exclusivity_window_years": drug_data.get("exclusivity_years", 0)
        }
    )
    
    return output.model_dump()
