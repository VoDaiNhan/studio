'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatSidebar } from '@/components/chat-sidebar';
import { ChatHeader } from '@/components/chat-header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Send, Loader2, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SITUATION_TEMPLATES = [
  {
    title: 'Tai nạn giao thông',
    icon: AlertCircle,
    prompt: 'Tôi vừa gặp tai nạn giao thông. Xe tôi va chạm với xe khác tại ngã tư. Tôi cần làm gì và trách nhiệm của các bên như thế nào?'
  },
  {
    title: 'Vi phạm nồng độ cồn',
    icon: AlertCircle,
    prompt: 'Tôi bị CSGT kiểm tra và phát hiện nồng độ cồn vượt mức cho phép. Mức phạt và hậu quả pháp lý là gì?'
  },
  {
    title: 'Tranh chấp hợp đồng',
    icon: FileText,
    prompt: 'Tôi đã ký hợp đồng mua bán nhưng bên kia không thực hiện đúng cam kết. Tôi có thể làm gì để bảo vệ quyền lợi?'
  },
  {
    title: 'Tư vấn khác',
    icon: Sparkles,
    prompt: ''
  }
];

export default function AIConsultantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý AI chuyên sâu về pháp luật. Tôi có thể giúp bạn phân tích các tình huống pháp lý cụ thể, tư vấn về quyền và nghĩa vụ, cũng như hướng dẫn các bước cần thực hiện.\n\nHãy mô tả tình huống của bạn một cách chi tiết để tôi có thể tư vấn chính xác nhất.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call AI API
      const response = await fetch('/api/ai-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          history: messages.slice(-5) // Send last 5 messages for context
        })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || 'Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateClick = (prompt: string) => {
    if (prompt) {
      setInput(prompt);
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-8 w-8" />
                <h1 className="text-2xl font-bold">Tư vấn AI chuyên sâu</h1>
              </div>
              <p className="text-blue-100">
                Phân tích tình huống pháp lý chi tiết và tư vấn giải pháp cụ thể
              </p>
            </div>
          </div>

          {/* Quick Templates */}
          {messages.length <= 1 && (
            <div className="p-6 bg-white border-b">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Tình huống thường gặp:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SITUATION_TEMPLATES.map((template, index) => (
                    <Card
                      key={index}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-500"
                      onClick={() => handleTemplateClick(template.prompt)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <template.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm text-gray-900">{template.title}</h3>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea ref={scrollRef} className="flex-1">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500">
                        <Bot className="h-5 w-5 text-white" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 px-2">
                      {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-gray-200">
                        <User className="h-5 w-5 text-gray-600" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500">
                      <Bot className="h-5 w-5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t bg-white p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Mô tả chi tiết tình huống của bạn... (Shift + Enter để xuống dòng)"
                  className="min-h-[80px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="h-[80px] px-6 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Thông tin được tạo bởi AI. Hãy tham khảo ý kiến chuyên gia pháp lý cho các quyết định quan trọng.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
