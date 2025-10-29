'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
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
import { useUser } from '@/firebase';

const quickReplies = [
  { icon: AlertTriangle, text: 'Nồng độ cồn cho phép là bao nhiêu?' },
  { icon: FileQuestion, text: 'Thủ tục đăng ký xe mới?' },
  { icon: MessageCircle, text: 'Vượt đèn vàng bị phạt bao nhiêu?' },
  { icon: Scale, text: 'Quy định về tốc độ trong khu dân cư?' },
];

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'error';
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
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
             viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isPending]);

  const handleFormSubmit = async (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query?.trim()) return;

    // Use anonymous UID if user is not logged in
    const finalUserId = user ? user.uid : 'anonymous';
    formData.set('userId', finalUserId);

    const userMessage: Message = { id: Date.now(), role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    formRef.current?.reset();
    inputRef.current?.focus();

    startTransition(async () => {
      const result = await getLawSummary({ query, userId: finalUserId }, formData); // Pass previous state as first arg
      if (result.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'error',
            content: `Rất tiếc, đã có lỗi xảy ra: ${result.error}`,
          },
        ]);
      } else if (result.summary) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: '', // content is not needed for assistant
            summary: result.summary,
            sourceArticles: result.sourceArticles,
          },
        ]);
      }
    });
  };

  const handleQuickReplyClick = (text: string) => {
    if (inputRef.current) {
      const formData = new FormData();
      formData.set('query', text);
      handleFormSubmit(formData);
    }
  };
  
  const chatStyle = {
    '--chat-primary-color': config.primaryColor,
    '--chat-accent-color': config.accentColor,
    '--chat-background-color': config.backgroundColor,
  } as React.CSSProperties;


  return (
    <Card className="h-full flex flex-col" style={chatStyle}>
      <CardHeader style={{ backgroundColor: 'var(--chat-primary-color)' }} className="text-primary-foreground">
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
      <CardContent className="flex-1 p-0 overflow-hidden" style={{ backgroundColor: 'var(--chat-background-color)' }}>
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
                            style={{borderColor: 'var(--chat-accent-color)'}}
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
                                <AvatarFallback className="bg-primary text-primary-foreground" style={{ backgroundColor: 'var(--chat-primary-color)' }}><Bot /></AvatarFallback>
                            </Avatar>
                         )}
                         <div className={`rounded-lg p-3 max-w-[80%] text-sm ${
                             message.role === 'user'
                               ? 'text-primary-foreground'
                               : message.role === 'error'
                               ? 'bg-destructive/10 text-destructive'
                               : 'bg-background'
                         }`}
                           style={ message.role === 'user' ? { backgroundColor: 'var(--chat-primary-color)' } : {}}
                         >
                            {message.role === 'user' ? (
                                <p>{message.content}</p>
                            ) : message.role === 'assistant' ? (
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
                            ) : (
                                <p>{message.content}</p>
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
                      <AvatarFallback className="bg-primary text-primary-foreground" style={{ backgroundColor: 'var(--chat-primary-color)' }}><Bot /></AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 max-w-[80%] text-sm bg-background flex items-center">
                      <Loader2 className="animate-spin h-5 w-5" />
                  </div>
              </div>
            )}
           </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t">
        <form 
            ref={formRef} 
            action={handleFormSubmit}
            className="relative"
        >
          <Input ref={inputRef} name="query" placeholder="Nhập câu hỏi của bạn..." className="pr-12" disabled={isPending} />
          <SubmitButton />
        </form>
      </div>
    </Card>
  );
}
