'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { LineChartComponent } from '@/components/charts/LineChartComponent';
import {
  BarChart3,
  Globe,
  FileSearch,
  Microscope,
  Database,
  Search,
  ChevronRight,
  ExternalLink,
  Download,
} from 'lucide-react';

const agentResults = [
  {
    id: 'iqvia',
    name: 'IQVIA Agent',
    icon: BarChart3,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    status: 'completed',
    lastUpdated: '2 min ago',
    summary: 'Market analysis for oncology therapeutics showing $45.2B opportunity',
    data: {
      marketData: [
        { region: 'North America', value: 18.5, growth: 8.2 },
        { region: 'Europe', value: 12.3, growth: 6.8 },
        { region: 'Asia Pacific', value: 9.8, growth: 12.4 },
        { region: 'Latin America', value: 3.2, growth: 9.1 },
        { region: 'Middle East', value: 1.4, growth: 7.5 },
      ],
      trends: [
        { year: '2020', value: 32 },
        { year: '2021', value: 36 },
        { year: '2022', value: 39 },
        { year: '2023', value: 42 },
        { year: '2024', value: 45 },
      ]
    }
  },
  {
    id: 'exim',
    name: 'EXIM Agent',
    icon: Globe,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    status: 'completed',
    lastUpdated: '5 min ago',
    summary: 'API trade data shows increased imports from India and China',
    data: {
      tradeData: [
        { country: 'India', imports: 2450, exports: 890, growth: 15.2 },
        { country: 'China', imports: 1890, exports: 450, growth: 8.7 },
        { country: 'Germany', imports: 980, exports: 1200, growth: 4.3 },
        { country: 'Switzerland', imports: 560, exports: 890, growth: 6.1 },
      ]
    }
  },
  {
    id: 'patent',
    name: 'Patent Agent',
    icon: FileSearch,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    status: 'completed',
    lastUpdated: '10 min ago',
    summary: '12 key patents expiring in next 3 years, biosimilar opportunity identified',
    data: {
      patents: [
        { patent: 'US10234567', drug: 'Keytruda', holder: 'Merck', expiry: '2027', status: 'Active' },
        { patent: 'US10345678', drug: 'Opdivo', holder: 'BMS', expiry: '2025', status: 'Expiring' },
        { patent: 'US10456789', drug: 'Tecentriq', holder: 'Roche', expiry: '2028', status: 'Active' },
      ]
    }
  },
  {
    id: 'clinical',
    name: 'Clinical Trials Agent',
    icon: Microscope,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    status: 'completed',
    lastUpdated: '3 min ago',
    summary: '847 active trials in oncology, 234 in Phase III',
    data: {
      trials: [
        { phase: 'Phase I', count: 312 },
        { phase: 'Phase II', count: 301 },
        { phase: 'Phase III', count: 234 },
      ]
    }
  },
  {
    id: 'internal',
    name: 'Internal Docs Agent',
    icon: Database,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    status: 'completed',
    lastUpdated: '1 hour ago',
    summary: '15 relevant internal documents found matching query criteria',
    data: {
      documents: [
        { title: 'Oncology Market Strategy 2024', type: 'Strategy', date: 'Nov 2024' },
        { title: 'HER2+ Competitive Analysis', type: 'Analysis', date: 'Oct 2024' },
        { title: 'Biosimilar Landscape Report', type: 'Report', date: 'Sep 2024' },
      ]
    }
  },
  {
    id: 'web',
    name: 'Web Intelligence Agent',
    icon: Search,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    status: 'completed',
    lastUpdated: '1 min ago',
    summary: 'Latest news and regulatory updates aggregated from 50+ sources',
    data: {
      news: [
        { title: 'FDA Approves New CDK4/6 Inhibitor for Breast Cancer', source: 'FDA.gov', date: 'Dec 2024' },
        { title: 'EMA Grants Orphan Designation to Novel Therapy', source: 'Reuters', date: 'Dec 2024' },
        { title: 'Merck Reports Positive Phase III Results', source: 'BioPharma Dive', date: 'Dec 2024' },
      ]
    }
  },
];

export default function ResultsPage() {
  const [selectedAgent, setSelectedAgent] = useState(agentResults[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agent Results</h1>
        <p className="text-gray-600 mt-1">Detailed outputs from all Worker Agents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {agentResults.map((agent) => {
            const Icon = agent.icon;
            const isSelected = selectedAgent.id === agent.id;
            return (
              <Card
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${agent.bgColor}`}>
                        <Icon className={`h-5 w-5 ${agent.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.lastUpdated}</p>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${isSelected ? 'text-primary-600' : 'text-gray-400'}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${selectedAgent.bgColor}`}>
                    <selectedAgent.icon className={`h-6 w-6 ${selectedAgent.color}`} />
                  </div>
                  <div>
                    <CardTitle>{selectedAgent.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{selectedAgent.summary}</p>
                  </div>
                </div>
                <Badge variant="success">{selectedAgent.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {selectedAgent.id === 'iqvia' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Market Size by Region (USD Billions)</h4>
                    <BarChartComponent
                      data={selectedAgent.data.marketData.map(d => ({ name: d.region, value: d.value }))}
                      xKey="name"
                      bars={[{ key: 'value', color: '#3b82f6', name: 'Market Size' }]}
                      height={250}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Market Growth Trend</h4>
                    <LineChartComponent
                      data={selectedAgent.data.trends}
                      xKey="year"
                      lines={[{ key: 'value', color: '#22c55e', name: 'Market Size (B)' }]}
                      height={200}
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Region</TableHead>
                        <TableHead>Market Size (B)</TableHead>
                        <TableHead>YoY Growth (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedAgent.data.marketData.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{row.region}</TableCell>
                          <TableCell>${row.value}B</TableCell>
                          <TableCell>
                            <Badge variant="success">+{row.growth}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {selectedAgent.id === 'exim' && (
                <div className="space-y-6">
                  <BarChartComponent
                    data={selectedAgent.data.tradeData.map(d => ({ 
                      name: d.country, 
                      imports: d.imports, 
                      exports: d.exports 
                    }))}
                    xKey="name"
                    bars={[
                      { key: 'imports', color: '#3b82f6', name: 'Imports (M)' },
                      { key: 'exports', color: '#22c55e', name: 'Exports (M)' },
                    ]}
                    height={300}
                  />
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Country</TableHead>
                        <TableHead>Imports (M)</TableHead>
                        <TableHead>Exports (M)</TableHead>
                        <TableHead>Growth</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedAgent.data.tradeData.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{row.country}</TableCell>
                          <TableCell>${row.imports}M</TableCell>
                          <TableCell>${row.exports}M</TableCell>
                          <TableCell>
                            <Badge variant="success">+{row.growth}%</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {selectedAgent.id === 'patent' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patent ID</TableHead>
                      <TableHead>Drug</TableHead>
                      <TableHead>Holder</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAgent.data.patents.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-sm">{row.patent}</TableCell>
                        <TableCell className="font-medium">{row.drug}</TableCell>
                        <TableCell>{row.holder}</TableCell>
                        <TableCell>{row.expiry}</TableCell>
                        <TableCell>
                          <Badge variant={row.status === 'Expiring' ? 'warning' : 'info'}>
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {selectedAgent.id === 'clinical' && (
                <div className="space-y-6">
                  <BarChartComponent
                    data={selectedAgent.data.trials.map(d => ({ name: d.phase, value: d.count }))}
                    xKey="name"
                    bars={[{ key: 'value', color: '#f59e0b', name: 'Trial Count' }]}
                    height={250}
                  />
                </div>
              )}

              {selectedAgent.id === 'internal' && (
                <div className="space-y-3">
                  {selectedAgent.data.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Database className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                          <p className="text-xs text-gray-500">{doc.type} • {doc.date}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" icon={<Download className="h-4 w-4" />}>
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {selectedAgent.id === 'web' && (
                <div className="space-y-3">
                  {selectedAgent.data.news.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.source} • {item.date}</p>
                      </div>
                      <Button variant="ghost" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
