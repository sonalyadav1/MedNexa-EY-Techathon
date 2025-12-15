import os
import json
from datetime import datetime
from typing import Dict, Any
from google import genai


def get_gemini_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")
    return genai.Client(api_key=api_key)


def summarize(aggregated_data: Dict[str, Any]) -> Dict[str, Any]:
    client = get_gemini_client()
    
    prompt = f"""You are a pharmaceutical portfolio analyst. Summarize the following data into an executive report.

STRICT RULES:
- Do NOT invent or modify any numbers
- Use ONLY the provided data
- Structure your output with these sections:
  1. Executive Summary (2-3 sentences overview)
  2. Key Findings (bullet points of important insights)
  3. Risks (potential concerns identified from data)
  4. Opportunities (growth potential and strategic advantages)

Data:
{json.dumps(aggregated_data, indent=2)}
"""
    
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    
    summary_text = response.text
    
    output = {
        "summary": summary_text,
        "gemini_model": "gemini-2.0-flash",
        "timestamp": datetime.now().isoformat()
    }
    
    return output
