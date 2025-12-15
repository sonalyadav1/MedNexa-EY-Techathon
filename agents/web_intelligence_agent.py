import json
from datetime import datetime
from typing import Dict, Any
from pathlib import Path


DATA_FILE = Path(__file__).parent.parent / "data" / "web_intelligence.json"


def load_web_data() -> Dict[str, Any]:
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def process(query_context: Dict[str, Any]) -> Dict[str, Any]:
    entities = query_context.get("extracted_entities", {})
    drug_name = entities.get("drug_name", "Drug X")
    
    raw_data = load_web_data()
    
    drug_data = None
    for drug in raw_data.get("drugs", []):
        if drug.get("name", "").lower() == drug_name.lower():
            drug_data = drug
            break
    
    if not drug_data:
        drug_data = raw_data["drugs"][0] if raw_data.get("drugs") else {}
    
    output = {
        "agent": "web_intelligence",
        "data": {
            "sentiment_score": drug_data.get("sentiment", 0),
            "news_mentions": drug_data.get("news_count", 0),
            "regulatory_updates": drug_data.get("regulatory", []),
            "market_rumors": drug_data.get("rumors", [])
        },
        "timestamp": datetime.now().isoformat()
    }
    
    return output
