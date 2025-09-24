'use client';
import { useState } from 'react';
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
import { Info, Paintbrush, BrainCircuit, History, FileText, PlusCircle, Upload, Link as LinkIcon, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const knowledgeSources = [
    { type: "pdf", title: "Luật Giao thông đường bộ 2008.pdf", date: "12/04/2023", status: "active" },
    { type: "txt", title: "Nghị định 100/2019/NĐ-CP.txt", date: "10/03/2023", status: "active" },
    { type: "url", title: "https://thuvienphapluat.vn/...", date: "05/02/2023", status: "learning" },
    { type: "pdf", title: "Thông tư 65/2020/TT-BCA.pdf", date: "01/01/2023", status: "error" },
];

export function ChatbotConfiguration() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [uploadType, setUploadType] = useState<'manual' | 'url'>('manual');

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
            <CardContent>
              <p>Cài đặt giao diện sẽ ở đây.</p>
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
                <Button onClick={() => setIsDialogOpen(true)}>
                    <PlusCircle className="w-4 h-4 mr-2"/>
                    Thêm nguồn
                </Button>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <div className="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 font-medium p-3 bg-muted/50 text-sm">
                        <div>Tên file</div>
                        <div>Ngày tải lên</div>
                        <div>Trạng thái</div>
                        <div className="text-right">Hành động</div>
                    </div>
                    {knowledgeSources.map((source, index) => (
                        <div key={index} className="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 items-center p-3 border-t text-sm">
                            <div className="flex items-center gap-2 font-medium">
                                <FileText className="w-4 h-4 text-primary"/>
                                <span className="truncate">{source.title}</span>
                            </div>
                            <div>{source.date}</div>
                            <div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    source.status === 'active' ? 'bg-green-100 text-green-800' : 
                                    source.status === 'learning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`
                                }>
                                    {source.status === 'active' ? 'Đang hoạt động' : source.status === 'learning' ? 'Đang học' : 'Lỗi'}
                                </span>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Edit className="h-4 w-4"/>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
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
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nguồn kiến thức</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Button variant={uploadType === 'manual' ? 'default' : 'outline'} onClick={() => setUploadType('manual')}>
                    <Upload className="w-4 h-4 mr-2"/>
                    Tải lên thủ công
                </Button>
                <Button variant={uploadType === 'url' ? 'default' : 'outline'} onClick={() => setUploadType('url')}>
                    <LinkIcon className="w-4 h-4 mr-2"/>
                    Từ URL
                </Button>
            </div>

            {uploadType === 'manual' ? (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Input id="title" placeholder="Ví dụ: Luật Giao thông đường bộ 2008" />
                    </div>
                     <div>
                        <Label htmlFor="content">Nội dung (hỗ trợ Markdown)</Label>
                        <Textarea id="content" placeholder="Dán nội dung tài liệu vào đây..." className="min-h-[200px]" />
                    </div>
                    <div className="p-4 text-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Kéo và thả file PDF, TXT hoặc DOCX vào đây, hoặc <span className="font-semibold text-primary">chọn file</span></p>
                        <p className="text-xs text-muted-foreground mt-1">Kích thước file tối đa 10MB</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="url">URL</Label>
                        <Input id="url" placeholder="https://example.com/document.pdf" />
                    </div>
                </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button>Lưu nguồn</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
