'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
} from 'lucide-react';

const summaryData = {
  title: 'Oncology Market Intelligence Report',
  query: 'Where is the unmet need in oncology for HER2+ breast cancer?',
  generatedAt: 'December 15, 2024 at 10:30 AM',
  status: 'completed',
  sections: {
    executiveSummary: `Based on comprehensive multi-agent analysis across IQVIA market data, clinical trials, patent intelligence, and web sources, we have identified significant unmet needs in the HER2+ breast cancer therapeutic landscape.

The global HER2+ breast cancer market is valued at $4.2 billion with a projected CAGR of 8.2% through 2028. Key opportunities exist in:
• Post-progression treatment options
• CNS metastases management
• Resistance mechanism targeting
• Novel antibody-drug conjugates`,
    
    keyFindings: [
      {
        title: 'Market Opportunity',
        description: '$4.2B addressable market with 8.2% CAGR, driven by increasing diagnosis rates and novel therapy adoption.',
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      {
        title: 'Treatment Gap',
        description: 'Limited options for patients who progress on first-line T-DXd, representing ~35% of advanced cases.',
        icon: Target,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'Clinical Pipeline',
        description: '47 active Phase II/III trials targeting HER2+ BC, with 12 novel mechanisms under investigation.',
        icon: Lightbulb,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      },
      {
        title: 'Patent Landscape',
        description: 'Key Herceptin patents expiring 2025-2027, creating biosimilar opportunities worth $1.2B annually.',
        icon: Clock,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      },
    ],
    
    risks: [
      'Competitive pressure from 6+ biosimilar entrants by 2026',
      'Pricing pressures in EU markets limiting profitability',
      'Complex regulatory pathways for novel ADC technologies',
      'Potential generic erosion in Asian markets',
    ],
    
    opportunities: [
      'First-mover advantage in CNS-penetrant HER2 targeting',
      'Combination therapy approaches with immunotherapy',
      'Companion diagnostic development for patient stratification',
      'Expansion into HER2-low expressing tumors (emerging segment)',
      'Strategic partnerships with Chinese biotech for regional access',
    ],
    
    recommendations: [
      'Prioritize development of CNS-active compounds',
      'Evaluate licensing opportunities for novel ADC payloads',
      'Consider biosimilar strategy for late-stage portfolio diversification',
      'Invest in real-world evidence generation for market access',
    ],
  },
  agentContributions: [
    { agent: 'IQVIA Agent', contribution: 'Market sizing, competitive landscape, pricing analysis' },
    { agent: 'Clinical Trials Agent', contribution: 'Pipeline analysis, trial design benchmarking' },
    { agent: 'Patent Agent', contribution: 'IP landscape, freedom-to-operate assessment' },
    { agent: 'EXIM Agent', contribution: 'API sourcing, supply chain analysis' },
    { agent: 'Web Intelligence', contribution: 'News aggregation, regulatory updates' },
    { agent: 'Internal Docs', contribution: 'Historical strategy documents, competitive files' },
  ],
};

export default function SummaryPage() {
  const [downloading, setDownloading] = useState(false);
  const searchParams = useSearchParams();
  const pdfPath = searchParams.get('pdfPath') || '';
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  const handleDownloadPDF = async () => {
    console.log('PDF Path:', pdfPath);
    if (!pdfPath) {
      alert('No PDF available for download.');
      return;
    }
    setDownloading(true);
    try {
      const url = `${API_BASE.replace(/\/$/, '')}/download-pdf?filename=${encodeURIComponent(pdfPath)}`;
      window.open(url, '_blank');
    } catch (e) {
      alert('Failed to download PDF.');
    }
    setDownloading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{summaryData.title}</h1>
          <p className="text-gray-600 mt-2">Query: "{summaryData.query}"</p>
          <p className="text-sm text-gray-500 mt-1">Generated: {summaryData.generatedAt}</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon={<Download className="h-5 w-5" />}
          onClick={handleDownloadPDF}
          disabled={downloading}
        >
          {downloading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-50 rounded-lg">
                <FileText className="h-5 w-5 text-primary-600" />
              </div>
              <CardTitle>Executive Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {summaryData.sections.executiveSummary}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle>Key Findings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summaryData.sections.keyFindings.map((finding, idx) => {
                const Icon = finding.icon;
                return (
                  <div key={idx} className={`p-4 rounded-lg ${finding.bgColor}`}>
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${finding.color}`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{finding.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{finding.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <CardTitle>Risks</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {summaryData.sections.risks.map((risk, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle>Opportunities</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {summaryData.sections.opportunities.map((opportunity, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Lightbulb className="h-5 w-5 text-purple-600" />
              </div>
              <CardTitle>Strategic Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summaryData.sections.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700 pt-1">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summaryData.agentContributions.map((item, idx) => (
                <div key={idx} className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{item.agent}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.contribution}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
