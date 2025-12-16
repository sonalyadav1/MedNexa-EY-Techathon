
from fastapi import FastAPI, Response, HTTPException
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import re
from app import run_query

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost:3000",  # your frontend origin
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
def analyze(payload: dict):
    query = payload["query"]
    result = run_query(query)
    return {
        "summary": result["summary"],
        "pdfFilename": result["pdfFilename"]
    }


OUTPUT_DIR = Path(__file__).parent / "outputs"

@app.get("/download-pdf")
def download_pdf(filename: str):
    # normalize and resolve
    file_path = (OUTPUT_DIR / filename).resolve()
    print(f"[download-pdf] Requested filename={filename}")
    print(f"[download-pdf] Looking in OUTPUT_DIR={OUTPUT_DIR.resolve()}")

    if file_path.exists():
        print(f"[download-pdf] Found file at {file_path}")
        stored_name = file_path.name
        m = re.search(r"(\d{8}_\d{6})", stored_name)
        ts = m.group(1) if m else stored_name.replace('.pdf', '')
        download_name = f"MedNexa Report - {ts}.pdf"
        return FileResponse(path=file_path, media_type="application/pdf", filename=download_name)

    # Fallback: try to find a close match in OUTPUT_DIR (in case of race or different process)
    candidates = [p for p in OUTPUT_DIR.iterdir() if p.is_file()]
    print(f"[download-pdf] OUTPUT_DIR contains {len(candidates)} files")
    match = None
    for p in candidates:
        if p.name == filename:
            match = p
            break
    if not match:
        # try substring match
        for p in candidates:
            if filename in p.name or p.name in filename:
                match = p
                break

    if match:
        print(f"[download-pdf] Serving fallback match {match}")
        stored_name = match.name
        m = re.search(r"(\d{8}_\d{6})", stored_name)
        ts = m.group(1) if m else stored_name.replace('.pdf', '')
        download_name = f"MedNexa Report - {ts}.pdf"
        return FileResponse(path=match.resolve(), media_type="application/pdf", filename=download_name)

    print(f"[download-pdf] File not found: {file_path}")
    raise HTTPException(status_code=404, detail="PDF not found")
