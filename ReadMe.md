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

---

## Deployment Guide: Render + Vercel

### 1. Prerequisites
- Push your complete project to a GitHub repository (public or private).
- Ensure your backend (FastAPI) and frontend (Next.js) are working locally.

### 2. Deploy Backend (FastAPI) on Render

1. Go to [https://render.com/](https://render.com/) and sign in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select your repository.
4. Set the root directory to your backend folder (if not root, e.g., `/` for root, or leave blank if backend is at repo root).
5. Set the **Start Command** to:
   ```
   uvicorn api:app --host 0.0.0.0 --port 10000
   ```
6. Set the **Python version** (e.g., 3.10+).
7. Add environment variables (e.g., `GEMINI_API_KEY`).
8. Click **Create Web Service** and wait for deployment.
9. After deployment, note your Render backend URL (e.g., `https://your-backend.onrender.com`).

### 3. Deploy Frontend (Next.js) on Vercel

1. Go to [https://vercel.com/](https://vercel.com/) and sign in.
2. Click **New Project** and import your GitHub repo.
3. Set the project root to `mednexa-frontend`.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = (your Render backend URL, e.g., `https://your-backend.onrender.com`)
5. Click **Deploy**.
6. After deployment, your frontend will be live at a Vercel URL (e.g., `https://your-frontend.vercel.app`).

### 4. (Optional) Add `render.yaml` for Render Automation

Create a `render.yaml` in your repo root for easier setup:
```yaml
services:
  - type: web
    name: mednexa-backend
    env: python
    buildCommand: ""
    startCommand: "uvicorn api:app --host 0.0.0.0 --port 10000"
    envVars:
      - key: GEMINI_API_KEY
        sync: false
    plan: free
```

### 5. (Optional) Custom Domain
- Set up a custom domain in Render (backend) and Vercel (frontend) if needed.

### 6. Troubleshooting
- Ensure CORS is enabled in FastAPI for your Vercel frontend domain.
- If you update your backend, redeploy on Render. For frontend, redeploy on Vercel.

---

**You are now ready to deploy and share your Mednexa platform!**
