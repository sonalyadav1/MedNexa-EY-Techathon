import json
from typing import Dict, Any
from pathlib import Path
from contracts.schemas import AgentOutput


DATA_FILE = Path(__file__).parent.parent / "data" / "clinical_trials_data.json"


def load_clinical_data() -> Dict[str, Any]:
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def process(query_context: Dict[str, Any]) -> Dict[str, Any]:
    entities = query_context.get("extracted_entities", {})
    drug_name = entities.get("drug_name", "Drug X")
    
    raw_data = load_clinical_data()
    
    drug_data = None
    for drug in raw_data.get("drugs", []):
        if drug.get("name", "").lower() == drug_name.lower():
            drug_data = drug
            break
    
    if not drug_data:
        drug_data = raw_data["drugs"][0] if raw_data.get("drugs") else {}
    
    trials = drug_data.get("trials", {})
    
    output = AgentOutput(
        agent="clinical_trials",
        data={
            "total_trials": drug_data.get("total_trials", 0),
            "phase_distribution": {
                "phase_1": trials.get("phase_1", 0),
                "phase_2": trials.get("phase_2", 0),
                "phase_3": trials.get("phase_3", 0),
                "phase_4": trials.get("phase_4", 0)
            },
            "completion_rate": drug_data.get("completion_rate", 0),
            "competitive_trials": drug_data.get("competitive_trials", 0)
        }
    )
    
    return output.model_dump()
