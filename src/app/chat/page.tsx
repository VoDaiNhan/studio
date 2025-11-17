'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { getLawSummary, type LawSummaryState } from '@/app/actions';
import { getAppearanceConfig, type AppearanceConfig } from '@/app/actions/appearance';
import { useUser, initializeFirebase } from '@/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Loader2, Mic, History } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ChatSidebar } from '@/components/chat-sidebar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'error';
  content: string;
  summary?: string;
  sourceArticles?: string;
}

function SubmitButton({ primaryColor }: { primaryColor?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button 
      size="icon" 
      type="submit" 
      disabled={pending} 
      className="absolute right-12 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-white"
      style={{ backgroundColor: primaryColor || '#06B6D4' }}
    >
      {pending ? <Loader2 className="animate-spin" /> : <Send className="h-4 w-4" />}
    </Button>
  );
}

function MicrophoneButton({ accentColor }: { accentColor?: string }) {
    return (
        <Button 
          size="icon" 
          type="button" 
          variant="ghost" 
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
          style={{ color: accentColor || '#06B6D4' }}
        >
            <Mic className="h-5 w-5" />
        </Button>
    )
}

function AiLogo() {
    return (
        <svg width="80" height="80" viewBox="0 0 81 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M33.568 56.216L24.8 79.024C24.8 79.024 21.2 80.224 19.448 78.472C17.696 76.72 18.896 73.12 18.896 73.12L27.472 50.8C27.472 50.8 30.68 50.152 32.24 51.944C33.8 53.736 33.568 56.216 33.568 56.216Z" fill="url(#paint0_linear_1_2)"/>
            <path d="M54.12 73.12L62.696 50.8C62.696 50.8 65.904 50.152 67.464 51.944C69.024 53.736 68.792 56.216 68.792 56.216L60.024 79.024C60.024 79.024 56.424 80.224 54.672 78.472C52.92 76.72 54.12 73.12 54.12 73.12Z" fill="url(#paint1_linear_1_2)"/>
            <path d="M46.736 0.943999L36.8 28.144L28.856 25.168L30.416 20.272L18.464 23.008L14.72 34.288L2.144 37.888L11.024 59.488L21.376 56.032L22.048 53.872L14.936 56.216L7.304 39.424L18.064 36.216L21.808 24.936L32.24 22.2L30.68 27.096L39.824 29.832L49.752 2.63199C49.752 2.63199 51.08 -0.424001 48.736 0.111999C46.392 0.647999 46.736 0.943999 46.736 0.943999Z" fill="url(#paint2_linear_1_2)"/>
            <path d="M46.736 0.943999L36.8 28.144L28.856 25.168L30.416 20.272L18.464 23.008L14.72 34.288L2.144 37.888L11.024 59.488L21.376 56.032L22.048 53.872L14.936 56.216L7.304 39.424L18.064 36.216L21.808 24.936L32.24 22.2L30.68 27.096L39.824 29.832L49.752 2.63199C49.752 2.63199 51.08 -0.424001 48.736 0.111999C46.392 0.647999 46.736 0.943999 46.736 0.943999Z" fill="url(#paint3_linear_1_2)" fillOpacity="0.2"/>
            <path d="M37.8631 34.823L47.5351 6.82299C47.5351 6.82299 43.7431 3.55899 41.5351 5.35899C39.3271 7.15899 39.4151 10.279 39.4151 10.279L30.6871 31.879L37.8631 34.823Z" fill="url(#paint4_linear_1_2)"/>
            <defs>
                <linearGradient id="paint0_linear_1_2" x1="26.336" y1="50.2" x2="26.336" y2="79.6" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00BAF4"/>
                <stop offset="1" stopColor="#0058F9"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1_2" x1="61.536" y1="50.2" x2="61.536" y2="79.6" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00E5E5"/>
                <stop offset="1" stopColor="#00A2F9"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1_2" x1="26.336" y1="0" x2="26.336" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00BAF4"/>
                <stop offset="1" stopColor="#0058F9"/>
                </linearGradient>
                <linearGradient id="paint3_linear_1_2" x1="25.948" y1="0.5" x2="25.948" y2="59.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="white" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="paint4_linear_1_2" x1="39.6151" y1="5.19999" x2="39.6151" y2="35.4" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00E5E5"/>
                <stop offset="1" stopColor="#00A2F9"/>
                </linearGradient>
            </defs>
        </svg>
    )
}


export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [recentHistory, setRecentHistory] = useState<Array<{id: string, text: string, summary?: string, sourceArticles?: string}>>([]);
  const [config, setConfig] = useState<AppearanceConfig | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();

  // Load appearance config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const appearanceConfig = await getAppearanceConfig();
        setConfig(appearanceConfig);
        
        // Apply CSS variables for theming
        if (appearanceConfig) {
          document.documentElement.style.setProperty('--primary-color', appearanceConfig.primaryColor);
          document.documentElement.style.setProperty('--accent-color', appearanceConfig.accentColor);
          document.documentElement.style.setProperty('--background-color', appearanceConfig.backgroundColor);
        }
      } catch (error) {
        console.error('Error loading appearance config:', error);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
             viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isPending]);

  useEffect(() => {
    const loadRecentHistory = async () => {
      if (!user) {
        setRecentHistory([]);
        return;
      }

      try {
        const { firestore } = initializeFirebase();
        const { query, orderBy, limit, getDocs } = await import('firebase/firestore');
        const userConversationsCol = collection(firestore, 'users', user.uid, 'conversations');
        
        const q = query(
          userConversationsCol,
          orderBy('timestamp', 'desc'),
          limit(3)
        );
        
        const snapshot = await getDocs(q);
        const history = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.userQuery,
            summary: data.botSummary,
            sourceArticles: data.sourceArticles
          };
        });
        
        setRecentHistory(history);
      } catch (error) {
        console.error('Error loading recent history:', error);
        setRecentHistory([]);
      }
    };

    loadRecentHistory();
  }, [user]);

  const handleFormSubmit = async (formData: FormData) => {
    const currentQuery = formData.get('query') as string;
    if (!currentQuery?.trim()) return;

    const userId = user?.uid || 'anonymous';
    formData.set('userId', userId);

    const userMessage: Message = { id: Date.now(), role: 'user', content: currentQuery };
    const botMessage: Message = { id: Date.now() + 1, role: 'assistant', content: '' };
    
    setMessages((prev) => [...prev, userMessage, botMessage]);
    
    formRef.current?.reset();
    inputRef.current?.focus();
    setQuery('');

    startTransition(async () => {
      const result = await getLawSummary({ query: currentQuery, userId }, formData);
      
      let finalBotMessage: Message;
      if (result.error) {
        finalBotMessage = {
          ...botMessage,
          role: 'error',
          content: `Rất tiếc, đã có lỗi xảy ra: ${result.error}`,
        };
      } else {
        finalBotMessage = {
          ...botMessage,
          summary: result.summary,
          sourceArticles: result.sourceArticles,
        };
        
        // Save to Firestore from client (has auth context)
        if (user) {
          try {
            const { firestore } = initializeFirebase();
            const userConversationsCol = collection(firestore, 'users', user.uid, 'conversations');
            await addDoc(userConversationsCol, {
              userQuery: currentQuery,
              botSummary: result.summary,
              sourceArticles: result.sourceArticles,
              timestamp: Timestamp.now(),
              isVerified: false,
            });
            console.log('Conversation saved successfully from client');
          } catch (error) {
            console.error('Error saving conversation from client:', error);
          }
        }
      }
      
      setMessages((prev) => 
        prev.map(msg => msg.id === botMessage.id ? finalBotMessage : msg)
      );
    });
  };

  const loadConversation = (historyItem: {id: string, text: string, summary?: string, sourceArticles?: string}) => {
    const userMessage: Message = { 
      id: Date.now(), 
      role: 'user', 
      content: historyItem.text 
    };
    const botMessage: Message = { 
      id: Date.now() + 1, 
      role: 'assistant', 
      content: '',
      summary: historyItem.summary,
      sourceArticles: historyItem.sourceArticles
    };
    
    setMessages([userMessage, botMessage]);
  };

  return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar */}
            <ChatSidebar />
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full" ref={scrollAreaRef}>
                        <div className="p-4 flex flex-col gap-4">
                            {messages.length === 0 && !isPending ? (
                                <div className='flex flex-col items-center justify-center text-center h-full pt-20'>
                                    <AiLogo />
                                    <h2 className="text-2xl font-semibold mt-6 text-gray-700">
                                      {config?.displayName || 'AI Tra cứu Luật'} có thể hỗ trợ gì cho bạn?
                                    </h2>
                                    {config?.welcomeMessage && (
                                      <p className="text-sm text-gray-500 mt-2 max-w-md">
                                        {config.welcomeMessage}
                                      </p>
                                    )}
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                        {message.role !== 'user' && (
                                            <Avatar className="h-8 w-8 border">
                                                <AvatarFallback style={{ backgroundColor: config?.primaryColor || '#3B82F6' }} className="text-white">
                                                  <Bot />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={`rounded-lg p-3 max-w-[80%] text-sm shadow-sm ${
                                            message.role === 'user'
                                                ? 'text-white'
                                                : message.role === 'error'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-white'
                                        }`} style={message.role === 'user' ? { backgroundColor: config?.primaryColor || '#3B82F6' } : {}}>
                                            {message.role === 'user' ? (
                                                <p>{message.content}</p>
                                            ) : message.role === 'error' ? (
                                                <p>{message.content}</p>
                                            ) : message.summary ? (
                                                <div className="space-y-2">
                                                    <p>{message.summary}</p>
                                                    {message.sourceArticles && (
                                                        <>
                                                            <Separator />
                                                            <p className="text-xs text-gray-500">
                                                                <span className="font-semibold">Nguồn:</span> {message.sourceArticles}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
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
                        </div>
                    </ScrollArea>
                </div>
                <div className="p-4 w-full mx-auto flex-shrink-0">
                    <div className='bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200'>
                        <form 
                            ref={formRef} 
                            action={handleFormSubmit}
                            className="relative"
                        >
                            <Input 
                                ref={inputRef} 
                                name="query" 
                                placeholder="Nhập câu hỏi của bạn tại đây..." 
                                className="pr-24 h-12 text-base rounded-lg border-gray-300 focus:ring-cyan-400 focus:border-cyan-400" 
                                disabled={isPending}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                maxLength={2000}
                            />
                            <div className="absolute right-24 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                {query.length}/2000
                            </div>
                            <MicrophoneButton accentColor={config?.accentColor} />
                            <SubmitButton primaryColor={config?.primaryColor} />
                        </form>
                        <p className="text-xs text-center text-gray-400 mt-3">
                            Thông tin được tạo ra bằng AI. Hãy luôn cẩn trọng và sử dụng thông tin AI một cách có trách nhiệm.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
  );
}
