'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

const mockReports = [
  {
    id: '1',
    title: 'Oncology Market Intelligence - HER2+ Breast Cancer',
    query: 'Where is the unmet need in oncology for HER2+ breast cancer?',
    createdAt: 'Dec 15, 2024',
    status: 'completed',
    agents: ['IQVIA', 'Clinical Trials', 'Patent', 'Web Intelligence'],
    pages: 24,
  },
  {
    id: '2',
    title: 'GLP-1 Agonist Patent Landscape Analysis',
    query: 'Patent landscape for GLP-1 agonists and biosimilar opportunities',
    createdAt: 'Dec 14, 2024',
    status: 'completed',
    agents: ['Patent', 'IQVIA', 'Web Intelligence'],
    pages: 18,
  },
  {
    id: '3',
    title: 'Biosimilar Adalimumab Competitive Analysis',
    query: 'Competitive analysis of biosimilar adalimumab market',
    createdAt: 'Dec 13, 2024',
    status: 'completed',
    agents: ['IQVIA', 'EXIM', 'Patent'],
    pages: 15,
  },
  {
    id: '4',
    title: 'API Trade Data Analysis - India & China',
    query: 'EXIM trade data for pharmaceutical API imports from India and China',
    createdAt: 'Dec 12, 2024',
    status: 'completed',
    agents: ['EXIM', 'Web Intelligence'],
    pages: 12,
  },
  {
    id: '5',
    title: 'Phase III Clinical Trials - Immuno-Oncology',
    query: 'Active Phase III clinical trials in immuno-oncology space',
    createdAt: 'Dec 11, 2024',
    status: 'completed',
    agents: ['Clinical Trials', 'Patent', 'Web Intelligence'],
    pages: 20,
  },
  {
    id: '6',
    title: 'CAR-T Therapy Market Assessment',
    query: 'Market assessment for CAR-T therapies in hematological malignancies',
    createdAt: 'Dec 10, 2024',
    status: 'processing',
    agents: ['IQVIA', 'Clinical Trials', 'Patent', 'Internal Docs'],
    pages: 0,
  },
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.query.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">View and download generated intelligence reports</p>
        </div>
        <Button variant="primary" icon={<FileText className="h-4 w-4" />}>
          Generate New Report
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
              </select>
              <Button variant="outline" icon={<Calendar className="h-4 w-4" />}>
                Date Range
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Reports ({filteredReports.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Report</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Agents Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{report.title}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate max-w-md">
                          {report.query}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{report.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {report.agents.slice(0, 2).map((agent, idx) => (
                          <Badge key={idx} variant="default" className="text-xs">
                            {agent}
                          </Badge>
                        ))}
                        {report.agents.length > 2 && (
                          <Badge variant="default" className="text-xs">
                            +{report.agents.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={report.status === 'completed' ? 'success' : 'warning'}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {report.pages > 0 ? `${report.pages} pages` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/summary">
                          <Button variant="ghost" size="sm" icon={<Eye className="h-4 w-4" />}>
                            View
                          </Button>
                        </Link>
                        {report.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Download className="h-4 w-4" />}
                          >
                            PDF
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reports found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
