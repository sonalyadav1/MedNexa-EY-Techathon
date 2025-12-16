# Mednexa: Pharma Portfolio Planning Platform (Agentic AI)

Mednexa is a full-stack platform for pharmaceutical portfolio planning, combining a Python-based agentic backend (LangGraph, Gemini, FastAPI) with a modern Next.js/TypeScript frontend. It orchestrates specialized worker agents, aggregates insights, and generates executive PDF reports.

---

## System Architecture

### Folder Structure (Backend & Frontend)

```
MedNexa2/
├── app.py                # Backend entry point (CLI)
├── api.py                # FastAPI backend server
├── pyproject.toml        # Python dependencies
├── agents/               # All agent logic (IQVIA, EXIM, Patent, etc)
├── orchestration/        # LangGraph state machine, router, state
├── contracts/            # Pydantic schemas for agent IO
├── data/                 # Mock data files (JSON, CSV)
├── reports/              # PDF generation and templates
├── llm/                  # Gemini summarizer
├── outputs/              # Generated PDF reports
├── mednexa-frontend/     # Next.js 14 frontend (TypeScript, Tailwind)
│   ├── src/app/          # App Router pages (dashboard, chat, results, etc)
│   ├── components/       # UI, layout, chat, charts
│   ├── lib/              # Utilities
│   └── services/         # API service functions
```

### LangGraph Node Graph (Backend Flow)

```
START
	↓
[Parse User Query]
	↓
[Master Agent: Query Analysis]
	↓
[Rule-Based Router] ← Determines which agents to invoke based on query keywords
	↓
	├─→ [IQVIA Agent] ──┐
	├─→ [EXIM Agent] ────┤
	├─→ [Patent Agent] ──┤
	├─→ [Clinical Trials Agent] ──┤
	├─→ [Internal Knowledge Agent] ──┤
	└─→ [Web Intelligence Agent] ──┘
					↓
	[Aggregator Node] ← Collects all worker outputs into single JSON
					↓
	[Gemini Summarizer Node] ← **ONLY LLM CALL** (receives aggregated JSON)
					↓
	[PDF Report Generator]
					↓
	[END: Print file path]
```

---

## Backend Usage

### Command Line
```bash
python app.py "What is the market potential for Drug X in oncology?"
```

### Interactive Mode
```bash
python app.py
# Then enter your query when prompted
```

### API Server
```bash
uvicorn api:app --reload
```
POST to `/analyze` with `{ "query": "..." }` for summary and PDF.

### Environment Variables
- `GEMINI_API_KEY`: Required for Gemini summarization

### Output
- PDF reports are saved to `outputs/` directory
- Console displays processing status and executive summary

### Data
Mock data files are in `data/`:
- `iqvia_data.json`, `exim_data.csv`, `patent_data.json`, `clinical_trials_data.json`, `internal_knowledge.json`, `web_intelligence.json`

---

## Frontend Usage (mednexa-frontend)

### Prerequisites
- Node.js 18+, npm or yarn

### Installation
```bash
cd mednexa-frontend
npm install
```

### Development
```bash
npm run dev
# App at http://localhost:5000
```

### Production
```bash
npm run build
npm start
```

### Backend Integration
Set backend URL via `NEXT_PUBLIC_API_URL` or in `src/services/api.ts`.

---

## Demo Flow (End-to-End)

1. **Dashboard** → View KPIs and recent queries
2. **Chat** → Ask "Where is the unmet need in oncology?"
3. **Clarify** → Select region or mechanism focus
4. **Results** → Explore detailed agent outputs
5. **Summary** → View executive report with findings
6. **Download** → Generate PDF report

---

## Constraints & Design Principles
- Worker agents do **NOT** use LLMs
- Gemini is called **exactly ONCE** at the end
- All routing is rule-based (keyword matching)
- All inter-agent communication uses structured JSON
- Frontend and backend are fully decoupled (API-driven)

---

## License
Private - Mednexa

