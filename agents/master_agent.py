import re
from typing import Dict, Any, List
from contracts.schemas import QueryContext, ExtractedEntities
from orchestration.router import route_query


DRUG_PATTERNS = [
    r'\b(Drug\s*[A-Z])\b',
    r'\b([A-Z][a-z]+(?:mab|nib|lib|tib|zumab|tinib))\b',
    r'\b([A-Z][a-z]+(?:cept|vir|pril|sartan))\b',
]

THERAPEUTIC_AREAS = [
    "oncology", "cardiology", "neurology", "immunology", 
    "dermatology", "gastroenterology", "endocrinology",
    "pulmonology", "rheumatology", "nephrology"
]

REGIONS = {
    "us": "US",
    "usa": "US", 
    "united states": "US",
    "eu": "EU",
    "europe": "EU",
    "european": "EU",
    "apac": "APAC",
    "asia": "APAC",
    "pacific": "APAC",
    "asia pacific": "APAC",
    "global": "Global",
    "worldwide": "Global"
}


def extract_drug_name(query: str) -> str:
    for pattern in DRUG_PATTERNS:
        match = re.search(pattern, query, re.IGNORECASE)
        if match:
            return match.group(1)
    return "Drug X"


def extract_therapeutic_area(query: str) -> str:
    query_lower = query.lower()
    for area in THERAPEUTIC_AREAS:
        if area in query_lower:
            return area
    return "oncology"


def extract_regions(query: str) -> List[str]:
    query_lower = query.lower()
    found_regions = []
    
    for keyword, region in REGIONS.items():
        if keyword in query_lower and region not in found_regions:
            found_regions.append(region)
    
    if not found_regions:
        return ["US", "EU"]
    
    return found_regions


def extract_timeframe(query: str) -> str:
    year_pattern = r'\b(20\d{2})\b'
    years = re.findall(year_pattern, query)
    
    if len(years) >= 2:
        return f"{min(years)}-{max(years)}"
    elif len(years) == 1:
        return f"{years[0]}-2030"
    
    return "2025-2030"


def parse_query(query: str) -> Dict[str, Any]:
    drug_name = extract_drug_name(query)
    therapeutic_area = extract_therapeutic_area(query)
    regions = extract_regions(query)
    timeframe = extract_timeframe(query)
    required_agents = route_query(query)
    
    extracted_entities = ExtractedEntities(
        drug_name=drug_name,
        therapeutic_area=therapeutic_area,
        regions=regions,
        timeframe=timeframe
    )
    
    query_context = QueryContext(
        original_query=query,
        extracted_entities=extracted_entities,
        required_agents=required_agents
    )
    
    return query_context.model_dump()
