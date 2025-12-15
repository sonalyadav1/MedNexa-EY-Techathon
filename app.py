import os
import sys
from dotenv import load_dotenv

load_dotenv()

from orchestration.graph import run_workflow


def print_banner():
    print("=" * 60)
    print("  PHARMA PORTFOLIO PLANNING - AGENTIC AI SYSTEM")
    print("=" * 60)
    print()


def print_section(title: str):
    print()
    print("-" * 40)
    print(f"  {title}")
    print("-" * 40)


def main():
    print_banner()
    
    if not os.environ.get("GEMINI_API_KEY"):
        print("ERROR: GEMINI_API_KEY environment variable is not set.")
        print("Please set your Gemini API key and try again.")
        sys.exit(1)
    
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
    else:
        print("Enter your query (or press Enter for default):")
        print()
        query = input("> ").strip()
        
        if not query:
            query = "What is the market potential for Drug X in oncology?"
            print(f"\nUsing default query: {query}")
    
    print_section("PROCESSING QUERY")
    print(f"Query: {query}")
    print()
    
    try:
        result = run_workflow(query)
        
        print_section("WORKFLOW COMPLETE")
        
        if result.get("pdf_path"):
            print()
            print(f"Report generated: {result['pdf_path']}")
            print()
        
        if result.get("summary"):
            print_section("EXECUTIVE SUMMARY")
            print()
            print(result["summary"])
            print()
        
        print("=" * 60)
        print("  DONE")
        print("=" * 60)
        
    except Exception as e:
        print(f"\nERROR: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
