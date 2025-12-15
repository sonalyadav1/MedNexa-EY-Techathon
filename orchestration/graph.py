from typing import Dict, Any
from langgraph.graph import StateGraph, END
from langgraph.graph.state import CompiledStateGraph

from orchestration.state import AgentState
from contracts.schemas import AggregatedData
from agents.master_agent import parse_query
from agents import (
    iqvia_agent,
    exim_agent,
    patent_agent,
    clinical_trials_agent,
    internal_knowledge_agent,
    web_intelligence_agent
)
from llm.gemini_summarizer import summarize
from reports.generator import generate_pdf


def master_node(state: AgentState) -> AgentState:
    print("[Master Agent] Parsing query...")
    query_context = parse_query(state["user_query"])
    state["query_context"] = query_context
    state["selected_agents"] = query_context["required_agents"]
    state["worker_results"] = {}
    print(f"[Master Agent] Selected agents: {state['selected_agents']}")
    return state


def iqvia_node(state: AgentState) -> AgentState:
    if "iqvia" in state["selected_agents"]:
        print("[IQVIA Agent] Processing...")
        result = iqvia_agent.process(state["query_context"])
        state["worker_results"]["iqvia"] = result
    return state


def exim_node(state: AgentState) -> AgentState:
    if "exim" in state["selected_agents"]:
        print("[EXIM Agent] Processing...")
        result = exim_agent.process(state["query_context"])
        state["worker_results"]["exim"] = result
    return state


def patent_node(state: AgentState) -> AgentState:
    if "patent" in state["selected_agents"]:
        print("[Patent Agent] Processing...")
        result = patent_agent.process(state["query_context"])
        state["worker_results"]["patent"] = result
    return state


def clinical_trials_node(state: AgentState) -> AgentState:
    if "clinical_trials" in state["selected_agents"]:
        print("[Clinical Trials Agent] Processing...")
        result = clinical_trials_agent.process(state["query_context"])
        state["worker_results"]["clinical_trials"] = result
    return state


def internal_knowledge_node(state: AgentState) -> AgentState:
    if "internal_knowledge" in state["selected_agents"]:
        print("[Internal Knowledge Agent] Processing...")
        result = internal_knowledge_agent.process(state["query_context"])
        state["worker_results"]["internal_knowledge"] = result
    return state


def web_intelligence_node(state: AgentState) -> AgentState:
    if "web_intelligence" in state["selected_agents"]:
        print("[Web Intelligence Agent] Processing...")
        result = web_intelligence_agent.process(state["query_context"])
        state["worker_results"]["web_intelligence"] = result
    return state


def aggregator_node(state: AgentState) -> AgentState:
    print("[Aggregator] Consolidating worker results...")
    aggregated = AggregatedData(
        query_context=state["query_context"],
        worker_results=state["worker_results"]
    )
    state["aggregated_data"] = aggregated.model_dump()
    return state


def gemini_node(state: AgentState) -> AgentState:
    print("[Gemini Summarizer] Generating executive summary...")
    gemini_output = summarize(state["aggregated_data"])
    state["summary"] = gemini_output["summary"]
    return state


def pdf_generator_node(state: AgentState) -> AgentState:
    print("[PDF Generator] Creating report...")
    pdf_path = generate_pdf(state["summary"], state["aggregated_data"])
    state["pdf_path"] = pdf_path
    return state


def create_workflow() -> CompiledStateGraph:
    workflow = StateGraph(AgentState)
    
    workflow.add_node("master", master_node)
    workflow.add_node("iqvia", iqvia_node)
    workflow.add_node("exim", exim_node)
    workflow.add_node("patent", patent_node)
    workflow.add_node("clinical_trials", clinical_trials_node)
    workflow.add_node("internal_knowledge", internal_knowledge_node)
    workflow.add_node("web_intelligence", web_intelligence_node)
    workflow.add_node("aggregator", aggregator_node)
    workflow.add_node("gemini", gemini_node)
    workflow.add_node("pdf_generator", pdf_generator_node)
    
    workflow.set_entry_point("master")
    
    workflow.add_edge("master", "iqvia")
    workflow.add_edge("iqvia", "exim")
    workflow.add_edge("exim", "patent")
    workflow.add_edge("patent", "clinical_trials")
    workflow.add_edge("clinical_trials", "internal_knowledge")
    workflow.add_edge("internal_knowledge", "web_intelligence")
    workflow.add_edge("web_intelligence", "aggregator")
    workflow.add_edge("aggregator", "gemini")
    workflow.add_edge("gemini", "pdf_generator")
    workflow.add_edge("pdf_generator", END)
    
    return workflow.compile()


def run_workflow(query: str) -> Dict[str, Any]:
    workflow = create_workflow()
    
    initial_state: AgentState = {
        "user_query": query,
        "query_context": {},
        "selected_agents": [],
        "worker_results": {},
        "aggregated_data": {},
        "summary": "",
        "pdf_path": "",
        "error": None
    }
    
    result = workflow.invoke(initial_state)
    
    return result
