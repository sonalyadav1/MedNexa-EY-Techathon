import pandas as pd
from datetime import datetime
from typing import Dict, Any, List
from pathlib import Path


DATA_FILE = Path(__file__).parent.parent / "data" / "exim_data.csv"


def load_exim_data() -> pd.DataFrame:
    return pd.read_csv(DATA_FILE)


def process(query_context: Dict[str, Any]) -> Dict[str, Any]:
    entities = query_context.get("extracted_entities", {})
    drug_name = entities.get("drug_name", "Drug X")
    regions = entities.get("regions", ["US", "EU", "APAC"])
    
    df = load_exim_data()
    
    drug_df = df[df["drug_name"].str.lower() == drug_name.lower()]
    
    if drug_df.empty:
        drug_df = df[df["drug_name"] == "Drug X"]
    
    total_import = int(drug_df["import_kg"].sum())
    total_export = int(drug_df["export_kg"].sum())
    avg_tariff = float(drug_df["tariff_pct"].mean())
    
    barriers = drug_df[drug_df["barriers"] != "None"]["barriers"].tolist()
    
    top_exporters = ["India", "China"]
    
    output = {
        "agent": "exim",
        "data": {
            "import_volume_kg": total_import,
            "export_volume_kg": total_export,
            "top_exporters": top_exporters,
            "tariff_impact_pct": round(avg_tariff, 4),
            "trade_barriers": barriers if barriers else ["None identified"]
        },
        "timestamp": datetime.now().isoformat()
    }
    
    return output
