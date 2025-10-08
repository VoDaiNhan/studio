'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from './ui/button';
import { BrainCircuit, History, Paintbrush, PlusCircle, Trash2, Edit, FileText, Link as LinkIcon, Upload, Loader2, Calendar as CalendarIcon, User, Bot, Scale } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { KnowledgeSource } from '@/lib/knowledge';
import { getKnowledgeSources, createKnowledgeSource, updateKnowledgeSource, deleteKnowledgeSource } from '@/app/actions/knowledge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type DialogState = {
    open: boolean;
    mode: 'add' | 'edit';
    source: KnowledgeSource | null;
};

export function ChatbotConfiguration() {
    const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogState, setDialogState] = useState<DialogState>({ open: false, mode: 'add', source: null });
    const [uploadType, setUploadType] = useState<'manual' | 'url'>('url');
    const [effectiveDate, setEffectiveDate] = useState<Date | undefined>();

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
            if (source.content) {
                setUploadType('manual');
            } else {
                setUploadType('url');
            }
        } else {
            setEffectiveDate(new Date());
            setUploadType('url');
        }
    };

    const handleCloseDialog = () => {
        setDialogState({ open: false, mode: 'add', source: null });
        setEffectiveDate(undefined);
    };

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get('title') as string;
        const url = formData.get('url') as string;
        const content = formData.get('content') as string;

        const data = {
            title,
            url: uploadType === 'url' ? url : undefined,
            content: uploadType === 'manual' ? content : undefined,
            effectiveDate: effectiveDate?.toISOString(),
        }

        let result;
        if (dialogState.mode === 'add') {
            result = await createKnowledgeSource(data);
        } else if (dialogState.source) {
            result = await updateKnowledgeSource({
                id: dialogState.source.id,
                ...data
            });
        }

        if (result) {
            const sources = await getKnowledgeSources();
            setKnowledgeSources(sources);
        }
        handleCloseDialog();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa nguồn kiến thức này?')) {
            await deleteKnowledgeSource(id);
            const sources = await getKnowledgeSources();
            setKnowledgeSources(sources);
        }
    };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Cấu hình Chatbot</h2>
      <p className="text-muted-foreground mb-4">
        Tùy chỉnh giao diện, hành vi và kiến thức cho chatbot của bạn.
      </p>

      <Tabs defaultValue="knowledge">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">
            <Paintbrush className="w-4 h-4 mr-2" /> Giao diện
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <BrainCircuit className="w-4 h-4 mr-2" /> Kiến thức
          </TabsTrigger>
          <TabsTrigger value="scenario">
             <Bot className="w-4 h-4 mr-2" /> Kịch bản
          </TabsTrigger>
           <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" /> Lịch sử
          </TabsTrigger>
        </TabsList>
        <TabsContent value="appearance">
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
                      <Input id="displayName" defaultValue="Trợ lý Luật Giao thông" />
                      <p className="text-sm text-muted-foreground">Tên này sẽ được hiển thị cho người dùng cuối.</p>
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="welcomeMessage">Lời chào</Label>
                      <Textarea id="welcomeMessage" defaultValue="Chào bạn! Tôi có thể giúp gì cho bạn về Luật Giao thông đường bộ?" />
                      <p className="text-sm text-muted-foreground">Tin nhắn đầu tiên chatbot sẽ gửi.</p>
                   </div>
                    <div className="space-y-2">
                        <Label htmlFor="ai-persona">Persona của AI</Label>
                        <Select defaultValue="expert">
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
               <div className="space-y-4">
                  <h3 className="font-medium text-lg">Thương hiệu & Màu sắc</h3>
                  <div className="flex items-center gap-4">
                    <div className='space-y-2'>
                        <Label>Logo</Label>
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="https://picsum.photos/seed/logo/200" />
                            <AvatarFallback><Scale /></AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='space-y-2'>
                        <Label>Biểu tượng Chatbot</Label>
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="https://picsum.photos/seed/bot/200" />
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                    </div>
                  </div>
                  <Button variant="outline">Tải lên</Button>
               </div>
            </CardContent>
          </Card>
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
                    <div className="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 font-medium p-3 bg-muted/50 text-sm">
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
                            <div key={source.id} className="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 items-center p-3 border-t text-sm">
                                <div className="flex items-center gap-2 font-medium">
                                    <FileText className="w-4 h-4 text-primary"/>
                                    <span className="truncate">{source.title}</span>
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
        <TabsContent value="scenario">
          <Card>
            <CardHeader>
              <CardTitle>Kịch bản</CardTitle>
              <CardDescription>
                Xây dựng các luồng hội thoại có cấu trúc cho chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Chức năng xây dựng kịch bản sẽ được hiển thị ở đây.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử</CardTitle>
              <CardDescription>
                Xem lại lịch sử các cuộc hội thoại.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Lịch sử hội thoại sẽ được hiển thị ở đây.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
       <Dialog open={dialogState.open} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{dialogState.mode === 'add' ? 'Thêm nguồn kiến thức mới' : 'Chỉnh sửa nguồn kiến thức'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Button type="button" variant={uploadType === 'url' ? 'default' : 'outline'} onClick={() => setUploadType('url')}>
                        <LinkIcon className="w-4 h-4 mr-2"/>
                        Từ URL
                    </Button>
                    <Button type="button" variant={uploadType === 'manual' ? 'default' : 'outline'} onClick={() => setUploadType('manual')}>
                        <Upload className="w-4 h-4 mr-2"/>
                        Nhập thủ công
                    </Button>
                </div>

                {uploadType === 'manual' ? (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Tiêu đề</Label>
                            <Input name="title" id="title" placeholder="Ví dụ: Luật Giao thông đường bộ 2008" defaultValue={dialogState.source?.title || ''} required />
                        </div>
                         <div>
                            <Label htmlFor="content">Nội dung (văn bản thuần túy)</Label>
                            <Textarea name="content" id="content" placeholder="Dán nội dung tài liệu vào đây..." className="min-h-[200px]" defaultValue={dialogState.source?.content || ''} required />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Tiêu đề</Label>
                            <Input name="title" id="title" placeholder="Tên tài liệu sẽ được tự động điền từ URL" defaultValue={dialogState.source?.title || ''} />
                        </div>
                        <div>
                            <Label htmlFor="url">URL</Label>
                            <Input name="url" id="url" placeholder="https://example.com/document.pdf" defaultValue={dialogState.source?.url || ''} required type="url" />
                        </div>
                    </div>
                )}
                 <div>
                    <Label>Ngày có hiệu lực</Label>
                     <Popover>
                      <PopoverTrigger asChild>
                        <Button
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
