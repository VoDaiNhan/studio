'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getLawSummary, type LawSummaryState } from '@/app/actions';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Scale, FileQuestion, MessageCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

const quickReplies = [
  { icon: AlertTriangle, text: 'Nồng độ cồn cho phép là bao nhiêu?' },
  { icon: FileQuestion, text: 'Thủ tục đăng ký xe mới?' },
  { icon: MessageCircle, text: 'Vượt đèn vàng bị phạt bao nhiêu?' },
  { icon: Scale, text: 'Quy định về tốc độ trong khu dân cư?' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  summary?: string;
  sourceArticles?: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button size="icon" type="submit" disabled={pending} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
      {pending ? <Loader2 className="animate-spin" /> : <Send className="h-4 w-4" />}
    </Button>
  );
}

export function ChatPreview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [state, formAction] = useActionState<LawSummaryState, FormData>(getLawSummary, {
    summary: '',
    sourceArticles: '',
    error: '',
    query: ''
  });

  useEffect(() => {
    if (state.error) {
       setMessages(prev => prev.slice(0, -1));
    }
    if (state.summary) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '',
          summary: state.summary,
          sourceArticles: state.sourceArticles,
        },
      ]);
    }
  }, [state]);

  const handleFormSubmit = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (query?.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: query }]);
      formAction(formData);
      formRef.current?.reset();
    }
  };

  const handleQuickReplyClick = (text: string) => {
    if (inputRef.current) {
        inputRef.current.value = text;
        const formData = new FormData();
        formData.append('query', text);
        handleFormSubmit(formData);
    }
  };


  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary-foreground text-primary">
              <Bot />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-lg">Trợ lý Luật Giao thông</p>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-xs">Online</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 bg-muted/20">
        <ScrollArea className="h-full">
           <div className="p-4 flex flex-col gap-4">
            {messages.length === 0 ? (
                 <Card className="p-4 bg-background">
                    <p className="font-medium mb-3">Tôi có thể giúp gì cho bạn về Luật Giao thông?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {quickReplies.map((reply, index) => (
                        <Button 
                            key={index} 
                            variant="outline" 
                            className="justify-start h-auto py-2"
                            onClick={() => handleQuickReplyClick(reply.text)}
                        >
                            <reply.icon className="w-4 h-4 mr-2 shrink-0" />
                            <span className="whitespace-normal text-left">{reply.text}</span>
                        </Button>
                        ))}
                    </div>
                </Card>
            ) : (
                messages.map((message, index) => (
                    <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                         {message.role === 'assistant' && (
                            <Avatar className="h-8 w-8 border">
                                <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                            </Avatar>
                         )}
                         <div className={`rounded-lg p-3 max-w-[80%] text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                            {message.role === 'user' ? (
                                <p>{message.content}</p>
                            ) : (
                                <div className="space-y-2">
                                    <p className="font-semibold">Đây là câu trả lời cho câu hỏi của bạn:</p>
                                    <p>{message.summary}</p>
                                    {message.sourceArticles && (
                                        <>
                                            <Separator />
                                            <p className="text-xs text-muted-foreground">
                                                <span className="font-semibold">Nguồn:</span> {message.sourceArticles}
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                         </div>
                         {message.role === 'user' && (
                            <Avatar className="h-8 w-8 border">
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                         )}
                    </div>
                ))
            )}
            {state.error && (
                <div className="flex justify-start">
                     <div className="rounded-lg p-3 max-w-[80%] text-sm bg-destructive/10 text-destructive">
                        <p>{state.error}</p>
                     </div>
                </div>
            )}
           </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t">
        <form ref={formRef} action={handleFormSubmit} className="relative">
          <Input ref={inputRef} name="query" placeholder="Nhập câu hỏi của bạn..." className="pr-12" />
          <SubmitButton />
        </form>
      </div>
    </Card>
  );
}
