from fastapi import FastAPI
from app import run_query 

app = FastAPI()

@app.post("/analyze")
def analyze(payload: dict):
    query = payload["query"]
    result = run_query(query)
    return {
        "summary": result["summary"],
        "pdf_path": result["pdf_path"]
    }
