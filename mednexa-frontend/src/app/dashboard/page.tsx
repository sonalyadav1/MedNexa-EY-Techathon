'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LineChartComponent } from '@/components/charts/LineChartComponent';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { PieChartComponent } from '@/components/charts/PieChartComponent';
import { Loading } from '@/components/ui/Loading';
import {
  TrendingUp,
  FileText,
  Activity,
  Clock,
  Search,
  Database,
  Globe,
  Microscope,
  FileSearch,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

const mockStats = {
  totalQueries: 1247,
  reportsGenerated: 89,
  activeAgents: 6,
  avgResponseTime: 2.3,
};

const mockRecentQueries = [
  { id: '1', query: 'Unmet needs in oncology for HER2+ breast cancer', status: 'completed', timestamp: '2 min ago' },
  { id: '2', query: 'Patent landscape for GLP-1 agonists', status: 'completed', timestamp: '15 min ago' },
  { id: '3', query: 'Clinical trials Phase III for biosimilar adalimumab', status: 'processing', timestamp: '23 min ago' },
  { id: '4', query: 'EXIM trade data for API imports from India', status: 'completed', timestamp: '1 hour ago' },
];

const mockAgentStatus = [
  { name: 'IQVIA Agent', status: 'active', lastRun: '2 min ago', icon: BarChart3, color: 'text-blue-600' },
  { name: 'EXIM Agent', status: 'active', lastRun: '5 min ago', icon: Globe, color: 'text-green-600' },
  { name: 'Patent Agent', status: 'active', lastRun: '10 min ago', icon: FileSearch, color: 'text-purple-600' },
  { name: 'Clinical Trials', status: 'active', lastRun: '3 min ago', icon: Microscope, color: 'text-orange-600' },
  { name: 'Internal Docs', status: 'idle', lastRun: '1 hour ago', icon: Database, color: 'text-gray-600' },
  { name: 'Web Intelligence', status: 'active', lastRun: '1 min ago', icon: Search, color: 'text-cyan-600' },
];

const trendData = [
  { month: 'Jan', queries: 145, reports: 12 },
  { month: 'Feb', queries: 178, reports: 15 },
  { month: 'Mar', queries: 198, reports: 18 },
  { month: 'Apr', queries: 245, reports: 22 },
  { month: 'May', queries: 289, reports: 28 },
  { month: 'Jun', queries: 312, reports: 32 },
];

const queryDistribution = [
  { name: 'Market Analysis', value: 35 },
  { name: 'Clinical Trials', value: 25 },
  { name: 'Patent Search', value: 20 },
  { name: 'Trade Data', value: 12 },
  { name: 'Other', value: 8 },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to Mednexa Pharma Intelligence Platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Queries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalQueries.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reports Generated</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reportsGenerated}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeAgents}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}s</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
              Query & Report Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChartComponent
              data={trendData}
              xKey="month"
              lines={[
                { key: 'queries', color: '#3b82f6', name: 'Queries' },
                { key: 'reports', color: '#22c55e', name: 'Reports' },
              ]}
              height={280}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Query Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={queryDistribution} height={280} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Queries</CardTitle>
              <Link href="/chat" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {mockRecentQueries.map((query) => (
                <div key={query.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{query.query}</p>
                      <p className="text-xs text-gray-500 mt-1">{query.timestamp}</p>
                    </div>
                    <Badge variant={query.status === 'completed' ? 'success' : 'warning'}>
                      {query.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {mockAgentStatus.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.name} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg bg-gray-50 ${agent.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-500">Last run: {agent.lastRun}</p>
                      </div>
                    </div>
                    <Badge variant={agent.status === 'active' ? 'success' : 'default'}>
                      {agent.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
