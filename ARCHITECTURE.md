# COMPLETE ARCHITECTURAL DESIGN
## Pharma Portfolio Planning Agentic AI System

---

## 1. FOLDER STRUCTURE

```
pharma-portfolio-agent/
│
├── app.py                          # Main entry point (CLI)
├── requirements.txt                # Python dependencies
├── .env                            # Gemini API key
├── README.md                       # Setup instructions
│
├── agents/
│   ├── __init__.py
│   ├── master_agent.py             # Orchestration logic (LangGraph)
│   ├── iqvia_agent.py              # IQVIA market insights
│   ├── exim_agent.py               # Import/export trends
│   ├── patent_agent.py             # Patent landscape analysis
│   ├── clinical_trials_agent.py    # Clinical trials data
│   ├── internal_knowledge_agent.py # Internal company data
│   └── web_intelligence_agent.py   # Market intelligence
│
├── orchestration/
│   ├── __init__.py
│   ├── graph.py                    # LangGraph state machine definition
│   ├── state.py                    # Shared state schema (Pydantic)
│   └── router.py                   # Rule-based routing logic
│
├── contracts/
│   ├── __init__.py
│   └── schemas.py                  # JSON input/output contracts (Pydantic)
│
├── data/
│   ├── iqvia_data.json
│   ├── exim_data.csv
│   ├── patent_data.json
│   ├── clinical_trials_data.json
│   ├── internal_knowledge.json
│   └── web_intelligence.json
│
├── reports/
│   ├── __init__.py
│   ├── generator.py                # PDF generation logic
│   └── templates.py                # Report structure templates
│
├── llm/
│   ├── __init__.py
│   └── gemini_summarizer.py        # Single Gemini invocation point
│
└── outputs/                        # Generated PDF reports
    └── .gitkeep
```

---

## 2. LANGGRAPH NODE GRAPH (Textual Flow)

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

**Key LangGraph Characteristics:**
- **State Object**: Shared dictionary containing query, worker_results, aggregated_data, summary, pdf_path
- **Conditional Edges**: Rule-based routing (no LLM) using keyword matching
- **Parallel Execution**: Worker agents run independently
- **Single Pass**: No loops or re-planning

---

## 3. AGENT RESPONSIBILITIES

### **Master Agent** (`master_agent.py`)
- Parse user query into structured format
- Extract intent keywords (drug name, indication, region, timeframe)
- Does NOT call any LLM
- Output: `QueryContext` object

### **IQVIA Insights Agent** (`iqvia_agent.py`)
- Reads `data/iqvia_data.json`
- Filters market size, prescription trends, competitor data
- No LLM usage
- Output: Structured market insights JSON

### **EXIM Trends Agent** (`exim_agent.py`)
- Reads `data/exim_data.csv`
- Extracts import/export volumes, tariff impacts, regional trade flows
- No LLM usage
- Output: Trade trends JSON

### **Patent Landscape Agent** (`patent_agent.py`)
- Reads `data/patent_data.json`
- Identifies patent expirations, competitive filings, exclusivity windows
- No LLM usage
- Output: Patent analysis JSON

### **Clinical Trials Agent** (`clinical_trials_agent.py`)
- Reads `data/clinical_trials_data.json`
- Retrieves pipeline status, phase completion rates, competitive trials
- No LLM usage
- Output: Clinical pipeline JSON

### **Internal Knowledge Agent** (`internal_knowledge_agent.py`)
- Reads `data/internal_knowledge.json`
- Fetches internal forecasts, manufacturing capacity, R&D budgets
- No LLM usage
- Output: Internal data JSON

### **Web Intelligence Agent** (`web_intelligence_agent.py`)
- Reads `data/web_intelligence.json`
- Mock news sentiment, regulatory updates, market rumors
- No LLM usage
- Output: Intelligence brief JSON

### **Aggregator Node** (in `graph.py`)
- Merges all worker outputs into single structured JSON
- No transformation or interpretation
- Pure data consolidation

### **Gemini Summarizer Node** (`llm/gemini_summarizer.py`)
- **ONLY LLM CALL IN ENTIRE SYSTEM**
- Input: Aggregated JSON from all workers
- Prompt: "Summarize the following pharmaceutical portfolio data into executive insights. Do not invent data. Structure output with: Key Findings, Risks, Opportunities."
- Output: Natural language summary (string)

### **PDF Report Generator** (`reports/generator.py`)
- Input: Gemini summary + raw aggregated data
- Creates formatted PDF with sections
- No LLM usage
- Output: File path to PDF

---

## 4. INPUT/OUTPUT JSON CONTRACTS

### **Master Agent**
**Input:**
```json
{
  "query": "What is the market potential for Drug X in oncology?"
}
```

**Output (QueryContext):**
```json
{
  "original_query": "What is the market potential for Drug X in oncology?",
  "extracted_entities": {
    "drug_name": "Drug X",
    "therapeutic_area": "oncology",
    "regions": ["US", "EU"],
    "timeframe": "2025-2030"
  },
  "required_agents": ["iqvia", "patent", "clinical_trials", "web_intelligence"]
}
```

---

### **IQVIA Agent**
**Input:**
```json
{
  "drug_name": "Drug X",
  "therapeutic_area": "oncology",
  "regions": ["US", "EU"]
}
```

**Output:**
```json
{
  "agent": "iqvia",
  "data": {
    "market_size_usd": 4500000000,
    "growth_rate_cagr": 0.08,
    "prescription_trends": [
      {"year": 2024, "prescriptions": 120000},
      {"year": 2025, "prescriptions": 135000}
    ],
    "competitor_share": {
      "Drug Y": 0.35,
      "Drug Z": 0.28
    }
  },
  "timestamp": "2025-12-15T10:30:00Z"
}
```

---

### **EXIM Agent**
**Input:**
```json
{
  "drug_name": "Drug X",
  "regions": ["US", "EU", "APAC"]
}
```

**Output:**
```json
{
  "agent": "exim",
  "data": {
    "import_volume_kg": 12500,
    "export_volume_kg": 8900,
    "top_exporters": ["India", "China"],
    "tariff_impact_pct": 0.05,
    "trade_barriers": ["Regulatory approval delays in EU"]
  },
  "timestamp": "2025-12-15T10:30:00Z"
}
```

---

### **Patent Agent**
**Input:**
```json
{
  "drug_name": "Drug X",
  "therapeutic_area": "oncology"
}
```

**Output:**
```json
{
  "agent": "patent",
  "data": {
    "active_patents": 12,
    "expiring_soon": [
      {"patent_id": "US123456", "expiry_date": "2027-03-15"}
    ],
    "competitor_filings": 8,
    "exclusivity_window_years": 5
  },
  "timestamp": "2025-12-15T10:30:00Z"
}
```

---

### **Clinical Trials Agent**
**Input:**
```json
{
  "drug_name": "Drug X",
  "therapeutic_area": "oncology"
}
```

**Output:**
```json
{
  "agent": "clinical_trials",
  "data": {
    "total_trials": 45,
    "phase_distribution": {
      "phase_1": 10,
      "phase_2": 20,
      "phase_3": 12,
      "phase_4": 3
    },
    "completion_rate": 0.78,
    "competitive_trials": 23
  },
  "timestamp": "2025-12-15T10:30:00Z"
}
```

---

### **Internal Knowledge Agent**
**Input:**
```json
{
  "drug_name": "Drug X"
}
```

**Output:**
```json
{
  "agent": "internal_knowledge",
  "data": {
    "rd_budget_usd": 45000000,
    "manufacturing_capacity_units_per_year": 500000,
    "forecast_revenue_2025_usd": 120000000,
    "strategic_priority": "high"
  },
  "timestamp": "2025-12-15T10:30:00Z"
}
```

---

### **Web Intelligence Agent**
**Input:**
```json
{
  "drug_name": "Drug X",
  "therapeutic_area": "oncology"
}
```

**Output:**
```json
{
  "agent": "web_intelligence",
  "data": {
    "sentiment_score": 0.72,
    "news_mentions": 34,
    "regulatory_updates": [
      "FDA fast-track designation granted"
    ],
    "market_rumors": ["Potential acquisition by BigPharma Inc"]
  },
  "timestamp": "2025-12-15T10:30:00Z"
}
```

---

### **Aggregated JSON (Input to Gemini)**
```json
{
  "query_context": { /* QueryContext from Master */ },
  "worker_results": {
    "iqvia": { /* IQVIA output */ },
    "exim": { /* EXIM output */ },
    "patent": { /* Patent output */ },
    "clinical_trials": { /* Clinical output */ },
    "internal_knowledge": { /* Internal output */ },
    "web_intelligence": { /* Web output */ }
  },
  "aggregation_timestamp": "2025-12-15T10:35:00Z"
}
```

---

### **Gemini Output**
```json
{
  "summary": "Executive Summary:\n\nDrug X shows strong market potential in oncology with a projected $4.5B market size and 8% CAGR...\n\nKey Findings:\n- Market growth driven by unmet need in advanced oncology\n- 12 active patents with 5-year exclusivity window\n- 78% clinical trial completion rate indicates robust pipeline\n\nRisks:\n- Patent US123456 expiring in 2027 may expose to generics\n- Regulatory delays in EU affecting import volumes\n\nOpportunities:\n- FDA fast-track designation accelerates launch\n- Strategic priority alignment with $45M R&D budget",
  "gemini_model": "gemini-1.5-pro",
  "timestamp": "2025-12-15T10:36:00Z"
}
```

---

## 5. MASTER AGENT DECISION LOGIC (Rule-Based Router)

**Router Logic** (`orchestration/router.py`):

```
IF query contains ["market", "sales", "revenue", "prescription"]:
    → Invoke IQVIA Agent

IF query contains ["import", "export", "trade", "tariff"]:
    → Invoke EXIM Agent

IF query contains ["patent", "exclusivity", "IP", "expiration"]:
    → Invoke Patent Agent

IF query contains ["clinical", "trial", "pipeline", "phase"]:
    → Invoke Clinical Trials Agent

IF query contains ["internal", "budget", "capacity", "forecast"]:
    → Invoke Internal Knowledge Agent

IF query contains ["news", "sentiment", "regulatory", "competitor"]:
    → Invoke Web Intelligence Agent

DEFAULT:
    → Invoke ALL agents (comprehensive analysis)
```

**No LLM is used for routing decisions.**

---

## 6. MOCK DATA STRUCTURE PER AGENT

### **data/iqvia_data.json**
```json
{
  "drugs": [
    {
      "name": "Drug X",
      "therapeutic_area": "oncology",
      "market_size_usd": 4500000000,
      "growth_rate": 0.08,
      "prescriptions": [
        {"year": 2024, "count": 120000},
        {"year": 2025, "count": 135000}
      ],
      "competitors": {"Drug Y": 0.35, "Drug Z": 0.28}
    }
  ]
}
```

### **data/exim_data.csv**
```
drug_name,region,import_kg,export_kg,tariff_pct,barriers
Drug X,US,5000,3000,0.05,None
Drug X,EU,4500,2900,0.08,Regulatory delays
Drug X,APAC,3000,3000,0.03,None
```

### **data/patent_data.json**
```json
{
  "drugs": [
    {
      "name": "Drug X",
      "active_patents": 12,
      "expiring_patents": [
        {"id": "US123456", "expiry": "2027-03-15"}
      ],
      "exclusivity_years": 5
    }
  ]
}
```

### **data/clinical_trials_data.json**
```json
{
  "drugs": [
    {
      "name": "Drug X",
      "trials": {
        "phase_1": 10,
        "phase_2": 20,
        "phase_3": 12,
        "phase_4": 3
      },
      "completion_rate": 0.78
    }
  ]
}
```

### **data/internal_knowledge.json**
```json
{
  "drugs": [
    {
      "name": "Drug X",
      "rd_budget": 45000000,
      "capacity_units": 500000,
      "forecast_2025": 120000000,
      "priority": "high"
    }
  ]
}
```

### **data/web_intelligence.json**
```json
{
  "drugs": [
    {
      "name": "Drug X",
      "sentiment": 0.72,
      "news_count": 34,
      "regulatory": ["FDA fast-track"],
      "rumors": ["Acquisition talks"]
    }
  ]
}
```

---

## 7. EXACT POINT WHERE GEMINI IS INVOKED

**Location:** `llm/gemini_summarizer.py` → `summarize()` function

**Trigger Condition:**
- All worker agents have completed execution
- Aggregated JSON is validated and complete
- LangGraph state reaches `gemini_summarizer` node

**Input to Gemini:**
```python
aggregated_json = {
    "query_context": state["query_context"],
    "worker_results": state["worker_results"]
}

prompt = f"""
You are a pharmaceutical portfolio analyst. Summarize the following data into an executive report.

STRICT RULES:
- Do NOT invent or modify any numbers
- Use ONLY the provided data
- Structure output as: Executive Summary, Key Findings, Risks, Opportunities

Data:
{json.dumps(aggregated_json, indent=2)}
"""

# SINGLE GEMINI CALL
response = gemini_model.generate_content(prompt)
summary = response.text
```

**Output:**
- Natural language summary (string)
- Passed to PDF generator

**Guarantees:**
- Called exactly once per query
- No worker agent uses Gemini
- Router logic is pure Python (if/else)
- Gemini receives only aggregated structured data

---

## 8. LANGGRAPH STATE SCHEMA

**File:** `orchestration/state.py`

```python
from typing import TypedDict, List, Dict, Any

class AgentState(TypedDict):
    # Input
    user_query: str
    
    # Master Agent Output
    query_context: Dict[str, Any]
    selected_agents: List[str]
    
    # Worker Outputs
    worker_results: Dict[str, Any]
    
    # Aggregation
    aggregated_data: Dict[str, Any]
    
    # Gemini Output
    summary: str
    
    # Final Output
    pdf_path: str
    error: str | None
```

---

## 9. EXECUTION FLOW SUMMARY

1. **User Input** → `app.py` receives query via CLI
2. **Master Agent** → Parses query, extracts entities (NO LLM)
3. **Router** → Rule-based keyword matching selects agents
4. **Worker Agents** → Execute in parallel, read local files (NO LLM)
5. **Aggregator** → Merges all JSON outputs
6. **Gemini Summarizer** → **SINGLE LLM CALL** with aggregated JSON
7. **PDF Generator** → Creates report with Gemini summary + raw data
8. **Output** → Prints `"Report generated: outputs/report_20251215_103600.pdf"`

---

## 10. KEY CONSTRAINTS SATISFIED

✅ Worker agents do NOT use LLM  
✅ Worker agents read ONLY local mock files  
✅ Master Agent orchestrates via rule-based logic  
✅ Gemini called exactly once at the end  
✅ All communication via structured JSON  
✅ No web UI, no API, no frontend  
✅ Command-line interaction only  
✅ LangGraph conditional routing is rule-based  
✅ PDF generated to file system  
