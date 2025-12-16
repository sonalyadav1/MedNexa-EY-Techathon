import os
from datetime import datetime
from typing import Dict, Any, Optional, List
from pathlib import Path
import time

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

from reports.templates import get_styles


OUTPUT_DIR = Path(__file__).parent.parent / "outputs"


def format_currency(value: int) -> str:
    if value >= 1_000_000_000:
        return f"${value / 1_000_000_000:.2f}B"
    elif value >= 1_000_000:
        return f"${value / 1_000_000:.2f}M"
    else:
        return f"${value:,}"


def format_percentage(value: float) -> str:
    return f"{value * 100:.1f}%"


def create_data_table(data: list, col_widths: Optional[List[float]] = None) -> Table:
    table = Table(data, colWidths=col_widths)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c5282')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f7fafc')),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.HexColor('#1a202c')),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
    ]))
    return table


def generate_pdf(summary: str, aggregated_data: Dict[str, Any]) -> str:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"MedNexa_Report_{timestamp}.pdf"
    filepath = OUTPUT_DIR / filename
    
    doc = SimpleDocTemplate(
        str(filepath),
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    styles = get_styles()
    elements = []
    
    elements.append(Paragraph("MedNexa Report", styles['ReportTitle']))
    elements.append(Paragraph(
        f"Generated: {datetime.now().strftime('%B %d, %Y at %H:%M')}",
        styles['MetaInfo']
    ))
    elements.append(Spacer(1, 0.3 * inch))
    
    query_context = aggregated_data.get("query_context", {})
    entities = query_context.get("extracted_entities", {})
    
    elements.append(Paragraph("Query Information", styles['SectionHeader']))
    query_text = query_context.get("original_query", "N/A")
    elements.append(Paragraph(f"<b>Query:</b> {query_text}", styles['ReportBody']))
    elements.append(Paragraph(f"<b>Drug:</b> {entities.get('drug_name', 'N/A')}", styles['ReportBody']))
    elements.append(Paragraph(f"<b>Therapeutic Area:</b> {entities.get('therapeutic_area', 'N/A')}", styles['ReportBody']))
    elements.append(Paragraph(f"<b>Regions:</b> {', '.join(entities.get('regions', []))}", styles['ReportBody']))
    elements.append(Spacer(1, 0.2 * inch))
    
    elements.append(Paragraph("Executive Summary", styles['SectionHeader']))
    for para in summary.split('\n'):
        if para.strip():
            clean_para = para.replace('**', '').replace('*', '').strip()
            if clean_para.startswith('#'):
                clean_para = clean_para.lstrip('#').strip()
                elements.append(Paragraph(clean_para, styles['SubHeader']))
            elif clean_para.startswith('-') or clean_para.startswith('•'):
                clean_para = clean_para.lstrip('-•').strip()
                elements.append(Paragraph(f"• {clean_para}", styles['BulletText']))
            else:
                elements.append(Paragraph(clean_para, styles['ReportBody']))
    elements.append(Spacer(1, 0.2 * inch))
    
    worker_results = aggregated_data.get("worker_results", {})
    
    if "iqvia" in worker_results:
        elements.append(Paragraph("Market Intelligence (IQVIA)", styles['SectionHeader']))
        iqvia_data = worker_results["iqvia"].get("data", {})
        
        market_data = [
            ["Metric", "Value"],
            ["Market Size", format_currency(iqvia_data.get("market_size_usd", 0))],
            ["Growth Rate (CAGR)", format_percentage(iqvia_data.get("growth_rate_cagr", 0))],
        ]
        elements.append(create_data_table(market_data, [2.5*inch, 2.5*inch]))
        elements.append(Spacer(1, 0.15 * inch))
        
        competitors = iqvia_data.get("competitor_share", {})
        if competitors:
            comp_data = [["Competitor", "Market Share"]]
            for comp, share in competitors.items():
                comp_data.append([comp, format_percentage(share)])
            elements.append(create_data_table(comp_data, [2.5*inch, 2.5*inch]))
        elements.append(Spacer(1, 0.15 * inch))
    
    if "patent" in worker_results:
        elements.append(Paragraph("Patent Landscape", styles['SectionHeader']))
        patent_data = worker_results["patent"].get("data", {})
        
        patent_info = [
            ["Metric", "Value"],
            ["Active Patents", str(patent_data.get("active_patents", 0))],
            ["Competitor Filings", str(patent_data.get("competitor_filings", 0))],
            ["Exclusivity Window", f"{patent_data.get('exclusivity_window_years', 0)} years"],
        ]
        elements.append(create_data_table(patent_info, [2.5*inch, 2.5*inch]))
        elements.append(Spacer(1, 0.15 * inch))
    
    if "clinical_trials" in worker_results:
        elements.append(Paragraph("Clinical Trials Overview", styles['SectionHeader']))
        clinical_data = worker_results["clinical_trials"].get("data", {})
        
        phase_dist = clinical_data.get("phase_distribution", {})
        trial_info = [
            ["Metric", "Value"],
            ["Total Trials", str(clinical_data.get("total_trials", 0))],
            ["Completion Rate", format_percentage(clinical_data.get("completion_rate", 0))],
            ["Competitive Trials", str(clinical_data.get("competitive_trials", 0))],
        ]
        elements.append(create_data_table(trial_info, [2.5*inch, 2.5*inch]))
        elements.append(Spacer(1, 0.1 * inch))
        
        phase_data = [
            ["Phase 1", "Phase 2", "Phase 3", "Phase 4"],
            [
                str(phase_dist.get("phase_1", 0)),
                str(phase_dist.get("phase_2", 0)),
                str(phase_dist.get("phase_3", 0)),
                str(phase_dist.get("phase_4", 0))
            ]
        ]
        elements.append(create_data_table(phase_data, [1.25*inch, 1.25*inch, 1.25*inch, 1.25*inch]))
        elements.append(Spacer(1, 0.15 * inch))
    
    if "exim" in worker_results:
        elements.append(Paragraph("Trade & EXIM Analysis", styles['SectionHeader']))
        exim_data = worker_results["exim"].get("data", {})
        
        trade_info = [
            ["Metric", "Value"],
            ["Import Volume", f"{exim_data.get('import_volume_kg', 0):,} kg"],
            ["Export Volume", f"{exim_data.get('export_volume_kg', 0):,} kg"],
            ["Tariff Impact", format_percentage(exim_data.get("tariff_impact_pct", 0))],
        ]
        elements.append(create_data_table(trade_info, [2.5*inch, 2.5*inch]))
        elements.append(Spacer(1, 0.15 * inch))
    
    if "internal_knowledge" in worker_results:
        elements.append(Paragraph("Internal Analysis", styles['SectionHeader']))
        internal_data = worker_results["internal_knowledge"].get("data", {})
        
        internal_info = [
            ["Metric", "Value"],
            ["R&D Budget", format_currency(internal_data.get("rd_budget_usd", 0))],
            ["Manufacturing Capacity", f"{internal_data.get('manufacturing_capacity_units_per_year', 0):,} units/year"],
            ["2025 Revenue Forecast", format_currency(internal_data.get("forecast_revenue_2025_usd", 0))],
            ["Strategic Priority", internal_data.get("strategic_priority", "N/A").upper()],
        ]
        elements.append(create_data_table(internal_info, [2.5*inch, 2.5*inch]))
        elements.append(Spacer(1, 0.15 * inch))
    
    if "web_intelligence" in worker_results:
        elements.append(Paragraph("Market Intelligence", styles['SectionHeader']))
        web_data = worker_results["web_intelligence"].get("data", {})
        
        web_info = [
            ["Metric", "Value"],
            ["Sentiment Score", f"{web_data.get('sentiment_score', 0):.2f}"],
            ["News Mentions", str(web_data.get("news_mentions", 0))],
        ]
        elements.append(create_data_table(web_info, [2.5*inch, 2.5*inch]))
        elements.append(Spacer(1, 0.1 * inch))
        
        regulatory = web_data.get("regulatory_updates", [])
        if regulatory:
            elements.append(Paragraph("Regulatory Updates:", styles['SubHeader']))
            for update in regulatory:
                elements.append(Paragraph(f"• {update}", styles['BulletText']))
        elements.append(Spacer(1, 0.15 * inch))
    
    elements.append(Spacer(1, 0.3 * inch))
    elements.append(Paragraph("--- End of Report ---", styles['MetaInfo']))
    
    def _add_metadata(canvas_obj, doc_obj):
        try:
            canvas_obj.setTitle("MedNexa Report")
            canvas_obj.setAuthor("MedNexa")
            canvas_obj.setSubject("MedNexa - Pharmaceutical Portfolio Analysis")
        except Exception:
            pass

    doc.build(elements, onFirstPage=_add_metadata)
    # ensure file was written to disk before returning
    max_attempts = 5
    attempt = 0
    while attempt < max_attempts:
        if filepath.exists() and filepath.stat().st_size > 0:
            print(f"[generate_pdf] Returning PDF path: {filepath.resolve()}")
            return str(filepath.resolve())
        attempt += 1
        print(f"[generate_pdf] Waiting for file to appear (attempt {attempt})...")
        time.sleep(0.2)

    # If we reach here, file was not observed; raise an error to aid debugging
    print(f"[generate_pdf] ERROR: PDF file not found after {max_attempts} attempts: {filepath}")
    raise FileNotFoundError(f"Generated PDF not found: {filepath}")
