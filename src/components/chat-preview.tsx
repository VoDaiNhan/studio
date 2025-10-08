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
  const [isTransitioning, startTransition] = useTransition();

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
             viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isPending]);

  useEffect(() => {
    if (state.query && !isPending) {
        const userMessageExists = messages.some(msg => msg.role === 'user' && msg.content === state.query);

        if (state.error) {
            setMessages(prev => prev.filter(msg => !(msg.role === 'user' && msg.content === state.query)));
        } else if (state.summary && userMessageExists) {
            const assistantMessageExists = messages.some(msg => msg.role === 'assistant' && msg.summary === state.summary);
            if (!assistantMessageExists) {
                 setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now(),
                        role: 'assistant',
                        content: '', // content is not needed for assistant
                        summary: state.summary,
                        sourceArticles: state.sourceArticles,
                    },
                ]);
            }
        }
    }
  }, [state, isPending]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;

    if (query?.trim()) {
      setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: query }]);
    }
  };

  const handleQuickReplyClick = (text: string) => {
    if (inputRef.current) {
      inputRef.current.value = text;
      if(formRef.current) {
         startTransition(() => {
            const formData = new FormData(formRef.current!);
            formData.set('query', text);
            setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: text }]);
            formAction(formData);
            formRef.current?.reset();
        });
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
      <CardContent className="flex-1 p-0 bg-muted/20 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
           <div className="p-4 flex flex-col gap-4">
            {messages.length === 0 && !isPending && !isTransitioning ? (
                 <Card className="p-4 bg-background">
                    <p className="font-medium mb-3">{config.welcomeMessage}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {quickReplies.map((reply, index) => (
                        <Button 
                            key={index} 
                            variant="outline" 
                            className="justify-start h-auto py-2"
                            onClick={() => handleQuickReplyClick(reply.text)}
                            disabled={isPending || isTransitioning}
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
            {(isPending || isTransitioning) && (
              <div className="flex gap-3">
                  <Avatar className="h-8 w-8 border">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot /></AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 max-w-[80%] text-sm bg-background flex items-center">
                      <Loader2 className="animate-spin h-5 w-5" />
                  </div>
              </div>
            )}
            {state.error && (
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
            onReset={(e) => {
                inputRef.current?.focus();
            }}
        >
          <Input ref={inputRef} name="query" placeholder="Nhập câu hỏi của bạn..." className="pr-12" disabled={isPending || isTransitioning} />
          <SubmitButton />
        </form>
      </div>
    </Card>
  );
}
