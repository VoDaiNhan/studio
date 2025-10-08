'use client';

import { useState, useRef, useEffect, useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { getLawSummary, type LawSummaryState } from '@/app/actions';
import type { AppearanceConfig } from '@/app/actions/appearance';

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
  id: number;
  role: 'user' | 'assistant';
  content: string;
  summary?: string;
  sourceArticles?: string;
}

type ChatPreviewProps = {
    config: AppearanceConfig;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button size="icon" type="submit" disabled={pending} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
      {pending ? <Loader2 className="animate-spin" /> : <Send className="h-4 w-4" />}
    </Button>
  );
}

export function ChatPreview({ config }: ChatPreviewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [state, formAction, isPending] = useActionState<LawSummaryState, FormData>(getLawSummary, {
    summary: '',
    sourceArticles: '',
    error: '',
    query: ''
  });

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
    }
  }, [messages, isPending]);


  useEffect(() => {
    if (!state.query) return;

    const userMessageExists = messages.some(msg => msg.role === 'user' && msg.content === state.query);

    if (state.error) {
      if(userMessageExists) {
        setMessages(prev => prev.filter(msg => msg.content !== state.query));
      }
    } else if (state.summary) {
        const assistantMessageExists = messages.some(msg => msg.summary === state.summary);
        if (userMessageExists && !assistantMessageExists) {
             setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    role: 'assistant',
                    content: '',
                    summary: state.summary,
                    sourceArticles: state.sourceArticles,
                },
            ]);
        }
    }
  }, [state, messages]);


  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;

    if (query?.trim()) {
      setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: query }]);
      // The form's `action` prop will handle calling formAction
    }
  };

  const handleQuickReplyClick = (text: string) => {
    if (inputRef.current) {
      inputRef.current.value = text;
      if(formRef.current) {
        // Create a native submit event to trigger the form action
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        formRef.current.dispatchEvent(submitEvent);
      }
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
            <p className="font-bold text-lg">{config.displayName}</p>
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
        <ScrollArea className="h-full" ref={scrollAreaRef}>
           <div className="p-4 flex flex-col gap-4">
            {messages.length === 0 && !isPending ? (
                 <Card className="p-4 bg-background">
                    <p className="font-medium mb-3">{config.welcomeMessage}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {quickReplies.map((reply, index) => (
                        <Button 
                            key={index} 
                            variant="outline" 
                            className="justify-start h-auto py-2"
                            onClick={() => handleQuickReplyClick(reply.text)}
                            disabled={isPending}
                        >
                            <reply.icon className="w-4 h-4 mr-2 shrink-0" />
                            <span className="whitespace-normal text-left">{reply.text}</span>
                        </Button>
                        ))}
                    </div>
                </Card>
            ) : (
                messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
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
            {isPending && (
              <div className="flex gap-3">
                  <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 max-w-[80%] text-sm bg-background flex items-center">
                      <Loader2 className="animate-spin h-5 w-5" />
                  </div>
              </div>
            )}
            {state.error && state.query && !messages.some(m => m.content === state.query) && (
                <div className="flex justify-start">
                     <div className="rounded-lg p-3 max-w-[80%] text-sm bg-destructive/10 text-destructive">
                        <p>Rất tiếc, đã có lỗi xảy ra: {state.error}</p>
                     </div>
                </div>
            )}
           </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t">
        <form 
            ref={formRef} 
            action={formAction}
            onSubmit={handleFormSubmit}
            className="relative"
            onReset={() => inputRef.current?.focus()}
        >
          <Input ref={inputRef} name="query" placeholder="Nhập câu hỏi của bạn..." className="pr-12" disabled={isPending} />
          <SubmitButton />
        </form>
      </div>
    </Card>
  );
}
