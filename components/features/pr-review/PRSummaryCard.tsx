import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { apiFetch } from "@/lib/api/api";
import { AnalysisResponse, ApiResponse } from "@/types/api";
import { API_ENDPOINTS } from "@/lib/api/api";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PRSummaryCardProps {
  summary: string;
  fileGroups: Record<string, any>;
  initialAnalysis: string;
}

export default function PRSummaryCard({ summary, fileGroups, initialAnalysis }: PRSummaryCardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Initial Analysis:', initialAnalysis);
    if (initialAnalysis) {
      setMessages([{ 
        role: 'assistant', 
        content: initialAnalysis 
      }]);
    }
  }, [initialAnalysis]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    console.log('Sending message:', {
      prContext: summary,
      conversation: [...messages, userMessage]
    });

    try {
      const response = await apiFetch<AnalysisResponse>({
        url: API_ENDPOINTS.PR_ANALYSIS,
        method: 'POST',
        body: { 
          prContext: summary,
          conversation: [...messages, userMessage]
        }
      });

      console.log('Received response:', response);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.analysis 
      }]);
    } catch (error) {
      console.error('Chat Response Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">PR Review Notes</CardTitle>
        <CardDescription>AI-generated summary and analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Summary</h3>
            <p className="text-sm text-muted-foreground">{summary}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium mb-2">AI Analysis & Chat</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Ask a follow-up question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button 
                size="icon"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Files Changed by Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fileGroups).map(([type, files]) => (
                <div key={type} className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">.{type} ({files.length} files)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {files.map((file: any) => (
                      <li key={file.filename} className="flex justify-between">
                        <span className="truncate">{file.filename}</span>
                        <span className="ml-2 whitespace-nowrap">
                          <span className="text-green-600">+{file.additions}</span>
                          {' '}
                          <span className="text-red-600">-{file.deletions}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
