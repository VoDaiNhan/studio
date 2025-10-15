'use client';
import * as React from 'react';
import { useState, useEffect, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from './ui/button';
import { BrainCircuit, History, Paintbrush, PlusCircle, Trash2, Edit, FileText, Link as LinkIcon, Upload, Loader2, Calendar as CalendarIcon, User, Bot, Scale, Image as ImageIcon, CheckCircle2, FileUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import type { KnowledgeSource } from '@/lib/knowledge';
import { getKnowledgeSources, createKnowledgeSource, updateKnowledgeSource, deleteKnowledgeSource } from '@/app/actions/knowledge';
import { updateAppearanceConfig, type AppearanceConfig } from '@/app/actions/appearance';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { DateRange } from "react-day-picker";
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';

const AppearanceConfigSchema = z.object({
  displayName: z.string(),
  welcomeMessage: z.string(),
  aiPersona: z.enum(['expert', 'friendly', 'professional']),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

type DialogState = {
    open: boolean;
    mode: 'add' | 'edit';
    source: KnowledgeSource | null;
};

type ChatbotConfigurationProps = {
    config: AppearanceConfig;
    setConfig: (config: AppearanceConfig) => void;
};

type Conversation = {
    id: string;
    userQuery: string;
    botSummary: string;
    timestamp: {
      toDate: () => Date;
    };
    isVerified: boolean;
};

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export function ChatbotConfiguration({ config, setConfig }: ChatbotConfigurationProps) {
    const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogState, setDialogState] = useState<DialogState>({ open: false, mode: 'add', source: null });
    const [uploadType, setUploadType] = useState<'url' | 'manual' | 'file'>('url');
    const [effectiveDate, setEffectiveDate] = useState<Date | undefined>();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [logoFileName, setLogoFileName] = useState('Chưa có tệp nào được chọn');
    const [chatbotIconFileName, setChatbotIconFileName] = useState('Chưa có tệp nào được chọn');
    const [knowledgeFileName, setKnowledgeFileName] = useState('Chưa có tệp nào được chọn');
    const [date, setDate] = React.useState<DateRange | undefined>({
      from: subDays(new Date(), 20),
      to: new Date(),
    });
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    const firestore = useFirestore();
    const { user } = useUser();

    const conversationsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'conversations'), orderBy('timestamp', 'desc'));
    }, [firestore, user]);

    const { data: conversations, isLoading: isLoadingHistory } = useCollection<Conversation>(conversationsQuery);

    useEffect(() => {
        if (conversations && conversations.length > 0 && !selectedConversationId) {
            setSelectedConversationId(conversations[0].id);
        }
    }, [conversations, selectedConversationId]);


    useEffect(() => {
        const fetchSources = async () => {
            setIsLoading(true);
            const sources = await getKnowledgeSources();
            setKnowledgeSources(sources);
            setIsLoading(false);
        };
        fetchSources();
    }, []);

    const handleOpenDialog = (mode: 'add' | 'edit', source: KnowledgeSource | null = null) => {
        setDialogState({ open: true, mode, source });
        if (source) {
            setEffectiveDate(new Date(source.effectiveDate));
            setUploadType(source.type);
        } else {
            setEffectiveDate(new Date());
            setUploadType('url');
        }
        setKnowledgeFileName('Chưa có tệp nào được chọn');
    };

    const handleCloseDialog = () => {
        setDialogState({ open: false, mode: 'add', source: null });
        setEffectiveDate(undefined);
    };

    const handleSaveKnowledge = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;
        const url = formData.get('url') as string;
        const content = formData.get('content') as string;
        const file = formData.get('file') as File;

        let dataContent = content;
        if (uploadType === 'file' && file && file.size > 0) {
            dataContent = await fileToBase64(file);
        }

        const data: any = {
            title: title || (uploadType === 'file' && file.name ? file.name.replace(/\.(pdf|txt|doc|docx)$/i, '') : '') || (uploadType === 'url' ? 'Untitled URL' : 'Untitled'),
            type: uploadType,
            effectiveDate: effectiveDate?.toISOString(),
        };

        if (uploadType === 'url') {
            data.url = url;
        } else {
            data.content = dataContent;
        }


        let result;
        if (dialogState.mode === 'add') {
            result = await createKnowledgeSource(data as any);
        } else if (dialogState.source) {
            result = await updateKnowledgeSource({
                id: dialogState.source.id,
                ...data
            } as any);
        }

        if (result) {
            const sources = await getKnowledgeSources();
            setKnowledgeSources(sources);
        }
        handleCloseDialog();
    };
    
    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa nguồn kiến thức này không?')) {
            await deleteKnowledgeSource(id);
            const sources = await getKnowledgeSources();
            setKnowledgeSources(sources);
        }
    }
    
    const handleSaveAppearance = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const validatedData = AppearanceConfigSchema.safeParse(config);

        if (!validatedData.success) {
             toast({
                variant: "destructive",
                title: "Dữ liệu không hợp lệ!",
                description: "Vui lòng kiểm tra lại các trường đã nhập.",
            });
            return;
        }

        startTransition(async () => {
            const result = await updateAppearanceConfig(validatedData.data);
            if (result.success) {
                toast({
                    title: "Thành công!",
                    description: "Đã lưu cài đặt giao diện.",
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Ôi, có lỗi!",
                    description: result.error || "Không thể lưu cài đặt giao diện.",
                });
            }
        });
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFileName: React.Dispatch<React.SetStateAction<string>>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
        } else {
            setFileName('Chưa có tệp nào được chọn');
        }
    };

    const handleConfigChange = (field: keyof AppearanceConfig, value: string) => {
        setConfig({ ...config, [field]: value });
    };

    const selectedConversation = conversations?.find(c => c.id === selectedConversationId);


  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Cấu hình Chatbot</h2>
      <p className="text-muted-foreground mb-4">
        Tùy chỉnh giao diện, hành vi và kiến thức cho chatbot của bạn.
      </p>

      <Tabs defaultValue="appearance">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">
            <Paintbrush className="w-4 h-4 mr-2" /> Giao diện
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <BrainCircuit className="w-4 h-4 mr-2" /> Kiến thức
          </TabsTrigger>
           <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" /> Lịch sử
          </TabsTrigger>
        </TabsList>
        <TabsContent value="appearance">
            <form onSubmit={handleSaveAppearance}>
              <Card>
                <CardHeader>
                  <CardTitle>Giao diện</CardTitle>
                  <CardDescription>
                    Tùy chỉnh giao diện và cảm nhận của chatbot.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                      <h3 className="font-medium text-lg">Chung</h3>
                       <div className="space-y-2">
                          <Label htmlFor="displayName">Tên hiển thị</Label>
                          <Input name="displayName" id="displayName" value={config.displayName} onChange={e => handleConfigChange('displayName', e.target.value)} />
                          <p className="text-sm text-muted-foreground">Tên này sẽ được hiển thị cho người dùng cuối.</p>
                       </div>
                       <div className="space-y-2">
                          <Label htmlFor="welcomeMessage">Lời chào</Label>
                          <Textarea name="welcomeMessage" id="welcomeMessage" value={config.welcomeMessage} onChange={e => handleConfigChange('welcomeMessage', e.target.value)} />
                          <p className="text-sm text-muted-foreground">Tin nhắn đầu tiên chatbot sẽ gửi.</p>
                       </div>
                        <div className="space-y-2">
                            <Label htmlFor="ai-persona">Persona của AI</Label>
                            <Select name="ai-persona" value={config.aiPersona} onValueChange={value => handleConfigChange('aiPersona', value)}>
                                <SelectTrigger id="ai-persona">
                                    <SelectValue placeholder="Chọn một persona" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="expert">Chuyên gia</SelectItem>
                                    <SelectItem value="friendly">Thân thiện</SelectItem>
                                    <SelectItem value="professional">Chuyên nghiệp</SelectItem>
                                </SelectContent>
                            </Select>
                             <p className="text-sm text-muted-foreground">Điều này sẽ thay đổi giọng văn và phong cách trả lời của AI.</p>
                        </div>
                  </div>
                  <Separator />
                   <div className="space-y-6">
                        <h3 className="font-medium text-lg">Thương hiệu &amp; Màu sắc</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="primaryColor">Màu chính</Label>
                                <div className="relative">
                                    <Input id="primaryColor" name="primaryColor" type="color" value={config.primaryColor} onChange={e => handleConfigChange('primaryColor', e.target.value)} className="p-1 h-10 w-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accentColor">Màu nhấn</Label>
                                <Input id="accentColor" name="accentColor" type="color" value={config.accentColor} onChange={e => handleConfigChange('accentColor', e.target.value)} className="p-1 h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="backgroundColor">Màu nền</Label>
                                <Input id="backgroundColor" name="backgroundColor" type="color" value={config.backgroundColor} onChange={e => handleConfigChange('backgroundColor', e.target.value)} className="p-1 h-10 w-full" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="logo-upload">Logo</Label>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 rounded-md">
                                        <AvatarFallback><ImageIcon className="h-6 w-6 text-muted-foreground" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <Input id="logo-upload" name="logo" type="file" className="hidden" onChange={(e) => handleFileChange(e, setLogoFileName)} />
                                        <Label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                            Chọn tệp
                                        </Label>
                                        <span className="ml-3 text-sm text-muted-foreground">{logoFileName}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="chatbot-icon-upload">Biểu tượng Chatbot</Label>
                                <div className="flex items-center gap-4">
                                     <Avatar className="h-12 w-12 rounded-full">
                                        <AvatarFallback><Bot className="h-6 w-6 text-muted-foreground" /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <Input id="chatbot-icon-upload" name="chatbotIcon" type="file" className="hidden" onChange={(e) => handleFileChange(e, setChatbotIconFileName)} />
                                        <Label htmlFor="chatbot-icon-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                            Chọn tệp
                                        </Label>
                                        <span className="ml-3 text-sm text-muted-foreground">{chatbotIconFileName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>
                </CardContent>
                 <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Paintbrush className="mr-2 h-4 w-4" />}
                        Lưu Giao diện
                    </Button>
                </CardFooter>
              </Card>
            </form>
        </TabsContent>
        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg">Nguồn kiến thức</CardTitle>
                    <CardDescription>Thêm, sửa hoặc xóa các nguồn thông tin cho chatbot.</CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog('add')}>
                    <PlusCircle className="w-4 h-4 mr-2"/>
                    Thêm nguồn
                </Button>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <div className="grid grid-cols-[minmax(0,2fr),1fr,1fr,auto] gap-4 font-medium p-3 bg-muted/50 text-sm">
                        <div>Tên file</div>
                        <div>Ngày có hiệu lực</div>
                        <div>Trạng thái</div>
                        <div className="text-right">Hành động</div>
                    </div>
                    {isLoading ? (
                        <div className="p-4 text-center">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                        </div>
                    ) : knowledgeSources.length === 0 ? (
                         <div className="p-4 text-center text-sm text-muted-foreground">Chưa có nguồn kiến thức nào.</div>
                    ) : (
                        knowledgeSources.map((source) => (
                            <div key={source.id} className="grid grid-cols-[minmax(0,2fr),1fr,1fr,auto] gap-4 items-center p-3 border-t text-sm">
                                <div className="flex items-center gap-2 font-medium">
                                    <FileText className="w-4 h-4 text-primary flex-shrink-0"/>
                                    <span className="whitespace-normal break-words">{source.title}</span>
                                </div>
                                <div>{new Date(source.effectiveDate).toLocaleDateString('vi-VN')}</div>
                                <div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        source.status === 'active' ? 'bg-green-100 text-green-800' : 
                                        source.status === 'learning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`
                                    }>
                                        {source.status === 'active' ? 'Đang hoạt động' : source.status === 'learning' ? 'Đang học' : 'Lỗi'}
                                    </span>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog('edit', source)}>
                                        <Edit className="h-4 w-4"/>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(source.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
           <Card>
            <CardHeader>
              <CardTitle>Lịch sử trò chuyện</CardTitle>
              <div className="flex justify-between items-center">
                <CardDescription>
                  Xem lại và quản lý các cuộc trò chuyện đã diễn ra.
                </CardDescription>
                <div className={cn("grid gap-2")}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-6">
                <div className="col-span-1 border-r pr-4">
                     {isLoadingHistory ? (
                        <div className="space-y-3">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                     ) : (
                        <div className="flex flex-col gap-2">
                            {conversations?.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedConversationId(conv.id)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-md transition-colors",
                                        selectedConversationId === conv.id ? "bg-muted" : "hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-medium text-sm truncate pr-2 flex-1">{conv.userQuery}</p>
                                        {conv.isVerified && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0"/>}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {conv.timestamp?.toDate().toLocaleTimeString('vi-VN')} - {conv.timestamp?.toDate().toLocaleDateString('vi-VN')}
                                    </p>
                                </button>
                            ))}
                        </div>
                     )}
                </div>
                <div className="col-span-2">
                    {selectedConversation ? (
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-9 w-9 border">
                                    <AvatarFallback>
                                        <User/>
                                    </AvatarFallback>
                                </Avatar>
                                <div className="rounded-lg p-3 bg-muted max-w-xl">
                                    <p className="font-semibold text-sm">Câu hỏi</p>
                                    <p className="text-sm">{selectedConversation.userQuery}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <Avatar className="h-9 w-9 border">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        <Bot/>
                                    </AvatarFallback>
                                </Avatar>
                                <div className="rounded-lg p-3 bg-primary/10 max-w-xl">
                                    <p className="font-semibold text-sm text-primary">Câu trả lời</p>
                                    <p className="text-sm">{selectedConversation.botSummary}</p>
                                    {selectedConversation.sourceArticles && (
                                        <>
                                            <Separator className="my-2" />
                                            <p className="text-xs text-muted-foreground">
                                                <span className="font-semibold">Nguồn:</span> {selectedConversation.sourceArticles}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12">
                            <p>Chọn một cuộc trò chuyện để xem chi tiết</p>
                        </div>
                    )}
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
       <Dialog open={dialogState.open} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{dialogState.mode === 'add' ? 'Thêm nguồn kiến thức mới' : 'Chỉnh sửa nguồn kiến thức'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveKnowledge}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    <Button type="button" variant={uploadType === 'url' ? 'default' : 'outline'} onClick={() => setUploadType('url')}>
                        <LinkIcon className="w-4 h-4 mr-2"/>
                        Từ URL
                    </Button>
                    <Button type="button" variant={uploadType === 'file' ? 'default' : 'outline'} onClick={() => setUploadType('file')}>
                        <FileUp className="w-4 h-4 mr-2"/>
                        Tải tệp
                    </Button>
                    <Button type="button" variant={uploadType === 'manual' ? 'default' : 'outline'} onClick={() => setUploadType('manual')}>
                        <Edit className="w-4 h-4 mr-2"/>
                        Nhập thủ công
                    </Button>
                </div>

                {uploadType === 'manual' ? (
                    <div className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="title">Tiêu đề</Label>
                            <Input name="title" id="title" placeholder="Ví dụ: Luật Giao thông đường bộ 2008" defaultValue={dialogState.source?.title || ''} required />
                        </div>
                         <div>
                            <Label htmlFor="content">Nội dung (văn bản thuần túy)</Label>
                            <Textarea name="content" id="content" placeholder="Dán nội dung tài liệu vào đây..." className="min-h-[200px]" defaultValue={dialogState.source?.content || ''} required />
                        </div>
                    </div>
                ) : uploadType === 'url' ? (
                    <div className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="title">Tiêu đề (tùy chọn)</Label>
                            <Input name="title" id="title" placeholder="Tên tài liệu sẽ được tự động điền từ URL" defaultValue={dialogState.source?.title || ''} />
                        </div>
                        <div>
                            <Label htmlFor="url">URL</Label>
                            <Input name="url" id="url" placeholder="https://example.com/document.pdf" defaultValue={dialogState.source?.url || ''} required type="url" />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="title">Tiêu đề (tùy chọn)</Label>
                            <Input name="title" id="title" placeholder="Tên tài liệu sẽ được tự động điền từ tên tệp" defaultValue={dialogState.source?.title || ''} />
                        </div>
                        <div>
                            <Label htmlFor="file-upload">Tệp kiến thức</Label>
                             <div className="flex items-center gap-4">
                                <Input id="file-upload" name="file" type="file" className="hidden" onChange={(e) => handleFileChange(e, setKnowledgeFileName)} accept=".pdf,.txt,.doc,.docx" />
                                <Label htmlFor="file-upload" className="cursor-pointer w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                    <Upload className="w-4 h-4 mr-2"/>
                                    Chọn tệp
                                </Label>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground text-center">{knowledgeFileName}</p>
                        </div>
                    </div>
                )}
                 <div>
                    <Label>Ngày có hiệu lực</Label>
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !effectiveDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {effectiveDate ? format(effectiveDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={effectiveDate}
                          onSelect={setEffectiveDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>Hủy</Button>
                <Button type="submit">Lưu nguồn</Button>
              </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
