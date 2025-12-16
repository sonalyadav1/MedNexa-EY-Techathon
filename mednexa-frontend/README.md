# Mednexa Frontend

A modern, professional frontend for the Mednexa Pharma Intelligence Platform. This application provides a SaaS-style dashboard interface with conversational AI capabilities for pharmaceutical market intelligence.

## Features

- **Dashboard**: Overview of KPIs, recent queries, and agent status
- **Chat Interface**: Conversational flow with multi-agent intelligence
  - Open-ended questions support
  - Clarification prompts for ambiguous queries
  - Rich structured responses (tables, charts, links)
- **Results Page**: Detailed Worker Agent outputs (IQVIA, EXIM, Patent, Clinical Trials, Internal Docs, Web Intelligence)
- **Summary Page**: Gemini-generated reports with Executive Summary, Key Findings, Risks, Opportunities
- **Reports**: Historical report listing with PDF download
- **File Upload**: Upload PDFs for Internal Knowledge Agent processing

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd mednexa-frontend
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

## Backend Integration

Configure the backend URL by setting the environment variable:

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Or update directly in `src/services/api.ts`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard
│   ├── chat/               # Chat interface
│   ├── results/            # Agent results
│   ├── summary/            # Report summary
│   ├── reports/            # Reports listing
│   └── upload/             # File upload
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   ├── chat/               # Chat-specific components
│   └── charts/             # Chart components
├── lib/                    # Utility functions
└── services/               # API service functions
```

## Demo Flow

For a 3-4 minute demo showcasing pharma workflow:

1. **Dashboard** → View KPIs and recent queries
2. **Chat** → Ask "Where is the unmet need in oncology?"
3. **Clarify** → Select region or mechanism focus
4. **Results** → Explore detailed agent outputs
5. **Summary** → View executive report with findings
6. **Download** → Generate PDF report

## License

Private - Mednexa
