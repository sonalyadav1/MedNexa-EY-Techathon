import os
import json
from datetime import datetime
from typing import Dict, Any
import google.generativeai as genai



def configure_gemini():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")
    genai.configure(api_key=api_key)


def summarize(aggregated_data: Dict[str, Any]) -> Dict[str, Any]:
    configure_gemini()
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
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content(prompt)
    summary_text = response.text if hasattr(response, 'text') else str(response)
    output = {
        "summary": summary_text,
        "gemini_model": "gemini-2.0-flash",
        "timestamp": datetime.now().isoformat()
    }
    
    return output
