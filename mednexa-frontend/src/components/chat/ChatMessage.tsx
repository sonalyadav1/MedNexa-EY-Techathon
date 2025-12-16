'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { Download, ExternalLink, Bot, User, HelpCircle, FileText } from 'lucide-react';
import Link from 'next/link';

/* =======================
   Types
======================= */

export interface MessageData {
  type: 'table' | 'chart' | 'link' | 'pdf' | 'text';
  title?: string;
  content: unknown;
}

export interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  data?: MessageData[];
  needsClarification?: boolean;
  clarificationOptions?: string[];
  onClarificationSelect?: (option: string) => void;
  pdfPath?: string;
}

/* =======================
   Component
======================= */

export function ChatMessage({
  role,
  content,
  data,
  needsClarification,
  clarificationOptions,
  onClarificationSelect,
  pdfPath,
}: ChatMessageProps) {
  const isUser = role === 'user';

  if (role === 'assistant') {
    // eslint-disable-next-line no-console
    console.log('ChatMessage pdfPath prop:', pdfPath);
  }

  return (
    <div className={cn('flex w-full mb-4 chat-message', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('flex max-w-[85%]', isUser ? 'flex-row-reverse' : 'flex-row')}>
        {/* Avatar */}
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
            isUser ? 'bg-primary-600 ml-3' : 'bg-gray-200 mr-3'
          )}
        >
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-gray-600" />
          )}
        </div>

        {/* Message Body */}
        <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
          <div
            className={cn(
              'rounded-2xl px-4 py-3',
              isUser
                ? 'bg-primary-600 text-white rounded-tr-md'
                : 'bg-white border border-gray-200 text-gray-900 rounded-tl-md shadow-sm'
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>

          {/* Clarification Options */}
          {needsClarification && clarificationOptions && (
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="w-full flex items-center text-xs text-gray-500 mb-2">
                <HelpCircle className="h-3 w-3 mr-1" />
                Please select an option:
              </div>
              {clarificationOptions.map((option, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => onClarificationSelect?.(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {/* Structured Data */}
          {data && data.length > 0 && (
            <div className="mt-3 space-y-3 w-full">
              {data.map((item, idx) => (
                <Card key={idx} className="overflow-hidden">
                  {item.title && (
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">{item.title}</p>
                    </div>
                  )}

                  <CardContent className="p-4">
                    {item.type === 'table' && (
                      <DataTable data={item.content as Record<string, unknown>[]} />
                    )}

                    {item.type === 'chart' && (
                      <BarChartComponent
                        data={item.content as Record<string, string | number>[]}
                        xKey="name"
                        bars={[{ key: 'value', color: '#3b82f6', name: 'Value' }]}
                        height={200}
                      />
                    )}

                    {item.type === 'link' && (
                      <a
                        href={item.content as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {item.content as string}
                      </a>
                    )}

                    {item.type === 'pdf' && (
                      <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
                        Download PDF Report
                      </Button>
                    )}

                    {item.type === 'text' && (
                      <p className="text-sm text-gray-700">{item.content as string}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* View Report */}
          {role === 'assistant' && pdfPath && (
            <div className="mt-3 w-full flex justify-end">
              <Link href={{ pathname: '/summary', query: { pdfPath } }}>
                <Button variant="primary" size="sm" icon={<FileText className="h-4 w-4" />}>
                  View Report
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =======================
   Table Helper
======================= */

function DataTable({ data }: { data: Record<string, unknown>[] }) {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={col}>{String(row[col])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
