const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface QueryRequest {
  query: string;
  context?: string;
  follow_up?: boolean;
}

export interface AgentResponse {
  agent: string;
  data: Record<string, unknown>;
  status: 'success' | 'error' | 'pending';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  data?: AgentResponse[];
  needsClarification?: boolean;
  clarificationOptions?: string[];
}

export interface Report {
  id: string;
  title: string;
  query: string;
  created_at: string;
  status: 'completed' | 'processing' | 'failed';
  summary?: string;
  pdf_url?: string;
}

async function fetchWithError(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  async sendQuery(query: string, context?: string): Promise<any> {
    // Updated to call /analyze endpoint as per backend
    return fetchWithError(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: JSON.stringify({ query, context }),
    });
  },

  async getAgentResults(queryId: string): Promise<AgentResponse[]> {
    return fetchWithError(`${API_BASE_URL}/api/results/${queryId}`);
  },

  async getReports(): Promise<Report[]> {
    return fetchWithError(`${API_BASE_URL}/api/reports`);
  },

  async getReport(reportId: string): Promise<Report> {
    return fetchWithError(`${API_BASE_URL}/api/reports/${reportId}`);
  },

  async generatePDF(reportId: string): Promise<{ url: string }> {
    return fetchWithError(`${API_BASE_URL}/api/reports/${reportId}/pdf`);
  },

  async uploadDocument(file: File): Promise<{ id: string; status: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getDashboardStats(): Promise<{
    totalQueries: number;
    reportsGenerated: number;
    activeAgents: number;
    avgResponseTime: number;
  }> {
    return fetchWithError(`${API_BASE_URL}/api/stats`);
  },
};
