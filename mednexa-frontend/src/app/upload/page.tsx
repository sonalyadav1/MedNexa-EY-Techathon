'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  summary?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: 'Oncology_Strategy_2024.pdf',
      size: '2.4 MB',
      status: 'completed',
      progress: 100,
      summary: 'Strategic overview of oncology portfolio with focus on HER2+ and TNBC indications. Key recommendations for pipeline prioritization identified.',
    },
    {
      id: '2',
      name: 'Competitive_Analysis_Biosimilars.pdf',
      size: '1.8 MB',
      status: 'completed',
      progress: 100,
      summary: 'Competitive landscape analysis for biosimilar market entry. Contains pricing benchmarks and market share projections.',
    },
    {
      id: '3',
      name: 'Clinical_Trial_Protocol_v3.pdf',
      size: '3.1 MB',
      status: 'processing',
      progress: 65,
    },
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      status: 'uploading' as const,
      progress: 0,
    }));

    setFiles((prev) => [...uploadedFiles, ...prev]);

    uploadedFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: 'processing', progress: 100 }
              : f
          )
        );
        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? {
                    ...f,
                    status: 'completed',
                    summary: 'Document analyzed successfully. Key insights extracted and added to the internal knowledge base.',
                  }
                : f
            )
          );
        }, 2000);
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
          )
        );
      }
    }, 200);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-orange-500 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Document Upload</h1>
        <p className="text-gray-600 mt-1">
          Upload PDF documents to be processed by the Internal Knowledge Agent
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-12 text-center transition-colors',
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            )}
          >
            <Upload
              className={cn(
                'h-12 w-12 mx-auto mb-4',
                isDragging ? 'text-primary-500' : 'text-gray-400'
              )}
            />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports PDF files up to 50MB
            </p>
            <label>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
              <Button variant="primary" className="cursor-pointer">
                Select Files
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Uploaded Documents ({files.length})</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles([])}
                icon={<Trash2 className="h-4 w-4" />}
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {files.map((file) => (
                <div key={file.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          {getStatusIcon(file.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{file.size}</p>
                        
                        {file.status === 'uploading' && (
                          <div className="mt-2">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-600 rounded-full transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Uploading... {Math.round(file.progress)}%
                            </p>
                          </div>
                        )}
                        
                        {file.status === 'processing' && (
                          <div className="mt-2">
                            <Badge variant="warning">
                              <Clock className="h-3 w-3 mr-1" />
                              Processing with Internal Knowledge Agent...
                            </Badge>
                          </div>
                        )}
                        
                        {file.status === 'completed' && file.summary && (
                          <div className="mt-2 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-800">{file.summary}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          How Document Processing Works
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. Upload PDF documents containing internal reports, strategies, or research</li>
          <li>2. The Internal Knowledge Agent extracts and indexes key information</li>
          <li>3. Uploaded content becomes searchable through chat queries</li>
          <li>4. Insights are incorporated into generated reports automatically</li>
        </ul>
      </div>
    </div>
  );
}
