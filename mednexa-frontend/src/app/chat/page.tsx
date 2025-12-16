'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/services/api';
import { ChatMessage, MessageData } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { Loading } from '@/components/ui/Loading';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, History, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  data?: MessageData[];
  needsClarification?: boolean;
  clarificationOptions?: string[];
  pdfPath?: string;
}

const sampleResponses: Record<string, { content: string; data?: MessageData[]; clarification?: { needed: boolean; options: string[] } }> = {
  'oncology': {
    content: "I found several unmet needs in oncology. Let me provide you with a comprehensive analysis based on our multi-agent intelligence gathering.",
    data: [
      {
        type: 'table',
        title: 'Top Unmet Needs in Oncology',
        content: [
          { Area: 'HER2+ Breast Cancer', Gap: 'Limited options post-progression', Market: '$4.2B' },
          { Area: 'Triple Negative BC', Gap: 'Lack of targeted therapies', Market: '$2.8B' },
          { Area: 'NSCLC EGFR+', Gap: 'Resistance management', Market: '$6.1B' },
          { Area: 'Pancreatic Cancer', Gap: 'Early detection biomarkers', Market: '$1.9B' },
        ]
      },
      {
        type: 'chart',
        title: 'Market Opportunity by Indication (USD Billions)',
        content: [
          { name: 'HER2+ BC', value: 4.2 },
          { name: 'TNBC', value: 2.8 },
          { name: 'NSCLC', value: 6.1 },
          { name: 'Pancreatic', value: 1.9 },
        ]
      }
    ],
    clarification: {
      needed: true,
      options: ['By Region', 'By Mechanism of Action', 'By Treatment Line', 'By Patient Population']
    }
  },
  'clinical trials': {
    content: "Here are the current Phase III clinical trials for the therapeutic area you're interested in. The data is sourced from clinicaltrials.gov via our Clinical Trials Agent.",
    data: [
      {
        type: 'table',
        title: 'Active Phase III Clinical Trials',
        content: [
          { Trial: 'NCT05123456', Sponsor: 'Pfizer', Indication: 'NSCLC', Status: 'Recruiting', Enrollment: 450 },
          { Trial: 'NCT05234567', Sponsor: 'Roche', Indication: 'HER2+ BC', Status: 'Active', Enrollment: 380 },
          { Trial: 'NCT05345678', Sponsor: 'Novartis', Indication: 'AML', Status: 'Recruiting', Enrollment: 200 },
          { Trial: 'NCT05456789', Sponsor: 'AstraZeneca', Indication: 'Ovarian', Status: 'Completed', Enrollment: 520 },
        ]
      },
      {
        type: 'link',
        title: 'Reference',
        content: 'https://clinicaltrials.gov'
      }
    ]
  },
  'patent': {
    content: "I've analyzed the patent landscape using our Patent Intelligence Agent. Here's what I found regarding recent patent filings and expirations in this therapeutic area.",
    data: [
      {
        type: 'table',
        title: 'Key Patent Analysis',
        content: [
          { Patent: 'US10234567', Holder: 'Merck', Expiry: '2027', Drug: 'Keytruda analog', Status: 'Active' },
          { Patent: 'US10345678', Holder: 'BMS', Expiry: '2025', Drug: 'Opdivo combo', Status: 'Expiring Soon' },
          { Patent: 'US10456789', Holder: 'Regeneron', Expiry: '2029', Drug: 'IL-6 inhibitor', Status: 'Active' },
        ]
      },
      {
        type: 'pdf',
        title: 'Download Full Patent Report',
        content: '/api/reports/patent-analysis.pdf'
      }
    ]
  },
  'biosimilar': {
    content: "Analyzing biosimilar competition for the selected products. Our IQVIA and Patent agents have identified the following competitive landscape.",
    data: [
      {
        type: 'table',
        title: 'Biosimilar Competition Analysis',
        content: [
          { Reference: 'Humira', Biosimilars: 8, 'Price Erosion': '45%', 'Lead Competitor': 'Hadlima' },
          { Reference: 'Remicade', Biosimilars: 5, 'Price Erosion': '38%', 'Lead Competitor': 'Inflectra' },
          { Reference: 'Herceptin', Biosimilars: 6, 'Price Erosion': '42%', 'Lead Competitor': 'Ogivri' },
        ]
      },
      {
        type: 'chart',
        title: 'Price Erosion Timeline (%)',
        content: [
          { name: 'Year 1', value: 15 },
          { name: 'Year 2', value: 28 },
          { name: 'Year 3', value: 38 },
          { name: 'Year 4', value: 45 },
        ]
      }
    ]
  },
  'default': {
    content: "I understand your query. Let me analyze this using our multi-agent system. The Master Agent is coordinating between IQVIA, EXIM, Patent, Clinical Trials, Internal Docs, and Web Intelligence agents to gather comprehensive insights.",
    clarification: {
      needed: true,
      options: ['Market Analysis Focus', 'Clinical Development Focus', 'Competitive Intelligence Focus', 'Regulatory Focus']
    }
  }
};

function generateResponse(message: string): { content: string; data?: MessageData[]; needsClarification?: boolean; clarificationOptions?: string[] } {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('oncology') || lowerMessage.includes('unmet need') || lowerMessage.includes('cancer')) {
    const resp = sampleResponses['oncology'];
    return { ...resp, needsClarification: resp.clarification?.needed, clarificationOptions: resp.clarification?.options };
  }
  if (lowerMessage.includes('clinical trial') || lowerMessage.includes('phase')) {
    return sampleResponses['clinical trials'];
  }
  if (lowerMessage.includes('patent') || lowerMessage.includes('intellectual property')) {
    return sampleResponses['patent'];
  }
  if (lowerMessage.includes('biosimilar') || lowerMessage.includes('competition')) {
    return sampleResponses['biosimilar'];
  }
  
  const resp = sampleResponses['default'];
  return { ...resp, needsClarification: resp.clarification?.needed, clarificationOptions: resp.clarification?.options };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Welcome to Mednexa! I'm your AI-powered pharma intelligence assistant. I can help you with:\n\n• Market analysis and unmet needs\n• Clinical trial landscapes\n• Patent intelligence\n• Trade data and EXIM analysis\n• Competitive intelligence\n\nTry asking: \"Where is the unmet need in oncology?\"",
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Try backend first
      const backendResponse = await api.sendQuery(message);
      console.log('Backend response:', backendResponse);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: backendResponse.summary || 'Here is your analysis.',
        timestamp: new Date(),
        data: backendResponse.data,
        pdfPath: backendResponse.pdfFilename, // Use filename from backend
        // Add more mapping if backend returns clarification, etc.
      };
      console.log('Assistant message pdfPath:', assistantMessage.pdfPath);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Fallback to hardcoded sample response
      const response = generateResponse(message);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        data: response.data,
        needsClarification: response.needsClarification,
        clarificationOptions: response.clarificationOptions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }
    setIsLoading(false);
  };

  const handleClarification = (option: string) => {
    handleSend(`I'd like to focus on: ${option}`);
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Mednexa Chat</h1>
              <p className="text-sm text-gray-500">Multi-agent pharma intelligence</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="success">6 Agents Active</Badge>
            <button
              onClick={clearChat}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Clear chat"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-thin">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              data={message.data}
              needsClarification={message.needsClarification}
              clarificationOptions={message.clarificationOptions}
              onClarificationSelect={handleClarification}
              pdfPath={message.pdfPath}
            />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-3 text-gray-500">
              <Loading size="sm" />
              <span className="text-sm">Agents are analyzing your query...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <ChatInput
          onSend={handleSend}
          disabled={isLoading}
          placeholder="Ask about market trends, clinical trials, patents, or competitive intelligence..."
        />
      </div>
    </div>
  );
}
