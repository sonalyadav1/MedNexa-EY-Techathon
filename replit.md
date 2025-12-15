# Pharma Portfolio Planning - Agentic AI System

## Overview
A Python-based agentic AI system using LangGraph for pharmaceutical portfolio planning with mock data. The system orchestrates specialized worker agents and uses Gemini for final summarization to generate PDF reports.

## Architecture
See `ARCHITECTURE.md` for the complete system design including:
- Folder structure
- Agent responsibilities
- JSON contracts
- Data flow
- LangGraph node graph

## Key Components

### Agents (`agents/`)
- **Master Agent**: Parses queries, extracts entities, routes to worker agents (NO LLM)
- **IQVIA Agent**: Market size, prescriptions, competitor data
- **EXIM Agent**: Import/export volumes, tariffs, trade barriers
- **Patent Agent**: Patent landscape, expirations, exclusivity
- **Clinical Trials Agent**: Pipeline status, phase distribution, completion rates
- **Internal Knowledge Agent**: R&D budget, manufacturing capacity, forecasts
- **Web Intelligence Agent**: Sentiment, news, regulatory updates

### Orchestration (`orchestration/`)
- **graph.py**: LangGraph state machine definition
- **state.py**: Shared AgentState schema
- **router.py**: Rule-based keyword routing (NO LLM)

### LLM (`llm/`)
- **gemini_summarizer.py**: SINGLE Gemini call for executive summary

### Reports (`reports/`)
- **generator.py**: PDF generation with ReportLab
- **templates.py**: Report styling

## Usage

### Command Line
```bash
python app.py "What is the market potential for Drug X in oncology?"
```

### Interactive Mode
```bash
python app.py
# Then enter your query when prompted
```

## Environment Variables
- `GEMINI_API_KEY`: Required for Gemini summarization

## Output
- PDF reports are saved to `outputs/` directory
- Console displays processing status and executive summary

## Data
Mock data files are in `data/`:
- `iqvia_data.json`
- `exim_data.csv`
- `patent_data.json`
- `clinical_trials_data.json`
- `internal_knowledge.json`
- `web_intelligence.json`

## Constraints
- Worker agents do NOT use LLM
- Gemini is called exactly ONCE at the end
- All routing is rule-based (keyword matching)
- All inter-agent communication uses structured JSON
