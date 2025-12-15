import json
from datetime import datetime
from typing import Dict, Any
from pathlib import Path


DATA_FILE = Path(__file__).parent.parent / "data" / "iqvia_data.json"


def load_iqvia_data() -> Dict[str, Any]:
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def process(query_context: Dict[str, Any]) -> Dict[str, Any]:
    entities = query_context.get("extracted_entities", {})
    drug_name = entities.get("drug_name", "Drug X")
    
    raw_data = load_iqvia_data()
    
    drug_data = None
    for drug in raw_data.get("drugs", []):
        if drug.get("name", "").lower() == drug_name.lower():
            drug_data = drug
            break
    
    if not drug_data:
        drug_data = raw_data["drugs"][0] if raw_data.get("drugs") else {}
    
    prescription_trends = [
        {"year": p["year"], "prescriptions": p["count"]}
        for p in drug_data.get("prescriptions", [])
    ]
    
    output = {
        "agent": "iqvia",
        "data": {
            "market_size_usd": drug_data.get("market_size_usd", 0),
            "growth_rate_cagr": drug_data.get("growth_rate", 0),
            "prescription_trends": prescription_trends,
            "competitor_share": drug_data.get("competitors", {})
        },
        "timestamp": datetime.now().isoformat()
    }
    
    return output
