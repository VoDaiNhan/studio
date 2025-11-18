'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { AdminAccessDenied } from '@/components/admin-access-denied';
import { isAdmin } from '@/middleware/admin-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Search, FileText, Trash2, Edit, X, Save, Link as LinkIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getKnowledgeSources, createKnowledgeSource, updateKnowledgeSource, deleteKnowledgeSource } from '@/app/actions/knowledge';
import type { KnowledgeSource } from '@/lib/knowledge';
import { processFile, validateFile } from '@/lib/file-processor';

export default function KnowledgePage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<KnowledgeSource | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'manual' as 'url' | 'manual' | 'file',
    url: '',
    content: '',
    effectiveDate: new Date().toISOString().split('T')[0],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push('/login');
    }
  }, [user, authLoading, router, mounted]);

  useEffect(() => {
    if (user) {
      loadSources();
    }
  }, [user]);

  const loadSources = async () => {
    try {
      const data = await getKnowledgeSources();
      setSources(data);
    } catch (error) {
      console.error('Error loading sources:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách nguồn kiến thức',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (source?: KnowledgeSource) => {
    if (source) {
      setEditingSource(source);
      setFormData({
        title: source.title || '',
        type: source.type,
        url: source.url || '',
        content: source.content || '',
        effectiveDate: source.effectiveDate ? new Date(source.effectiveDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setEditingSource(null);
      setFormData({
        title: '',
        type: 'manual',
        url: '',
        content: '',
        effectiveDate: new Date().toISOString().split('T')[0],
      });
    }
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        title: 'Lỗi',
        description: validation.error,
        variant: 'destructive',
      });
      e.target.value = ''; // Reset input
      return;
    }

    setSelectedFile(file);
    
    // Auto-fill title from filename if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      setFormData({ ...formData, title: fileName });
    }

    // Show processing toast
    toast({
      title: 'Đang xử lý file',
      description: 'Vui lòng đợi...',
    });

    try {
      const processed = await processFile(file);
      setFormData({ 
        ...formData, 
        content: processed.content,
        title: formData.title || fileName.replace(/\.[^/.]+$/, '')
      });
      
      toast({
        title: 'Thành công',
        description: 'Đã xử lý file thành công',
      });
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xử lý file',
        variant: 'destructive',
      });
      e.target.value = ''; // Reset input
      setSelectedFile(null);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSource(null);
    setFormData({
      title: '',
      type: 'manual',
      url: '',
      content: '',
      effectiveDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Vui lòng nhập tiêu đề');
      }
      
      if (formData.type === 'url' && !formData.url.trim()) {
        throw new Error('Vui lòng nhập URL');
      }
      
      if (formData.type === 'manual' && !formData.content.trim()) {
        throw new Error('Vui lòng nhập nội dung');
      }
      
      if (formData.type === 'file' && !formData.content.trim()) {
        throw new Error('Vui lòng chọn file');
      }

      const dataToSave = {
        ...formData,
      };

      if (editingSource) {
        await updateKnowledgeSource({
          id: editingSource.id,
          ...dataToSave,
        });
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật nguồn kiến thức',
        });
      } else {
        await createKnowledgeSource(dataToSave);
        toast({
          title: 'Thành công',
          description: 'Đã thêm nguồn kiến thức mới',
        });
      }
      await loadSources();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving source:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu nguồn kiến thức',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nguồn kiến thức này?')) return;
    
    try {
      await deleteKnowledgeSource(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa nguồn kiến thức',
      });
      await loadSources();
    } catch (error) {
      console.error('Error deleting source:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa nguồn kiến thức',
        variant: 'destructive',
      });
    }
  };

  const filteredSources = sources.filter(source =>
    source.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || !mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin(user)) {
    return <AdminAccessDenied />;
  }

  return (
    <>
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Quản lý Kiến thức</h1>
                  <p className="text-muted-foreground mt-1">
                    Thêm, chỉnh sửa và quản lý nguồn kiến thức cho chatbot
                  </p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm nguồn
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Danh sách tài liệu</CardTitle>
                      <CardDescription>
                        Quản lý các văn bản pháp luật và tài liệu tham khảo
                      </CardDescription>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm tài liệu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày hiệu lực</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSources.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Chưa có nguồn kiến thức nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSources.map((source) => (
                          <TableRow key={source.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {source.type === 'url' ? (
                                  <LinkIcon className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <FileText className="h-4 w-4 text-blue-500" />
                                )}
                                {source.title || 'Không có tiêu đề'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {source.type === 'url' ? 'URL' : source.type === 'file' ? 'File' : 'Thủ công'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                                {source.status === 'active' ? 'Hoạt động' : 'Đang xử lý'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {source.effectiveDate ? new Date(source.effectiveDate).toLocaleDateString('vi-VN') : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(source)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(source.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
      </Card>
      </div>
    </div>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingSource ? 'Chỉnh sửa nguồn kiến thức' : 'Thêm nguồn kiến thức mới'}</DialogTitle>
          <DialogDescription>
            {editingSource ? 'Cập nhật thông tin nguồn kiến thức' : 'Thêm nguồn kiến thức mới cho chatbot'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề nguồn kiến thức"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Loại nguồn</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'url' | 'manual' | 'file') => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Nhập thủ công</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="file">File</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'url' && (
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/document.pdf"
              />
              <p className="text-xs text-muted-foreground">
                URL của tài liệu PDF hoặc văn bản trực tuyến
              </p>
            </div>
          )}

          {formData.type === 'file' && (
            <div className="space-y-2">
              <Label htmlFor="file">Chọn file</Label>
              <div className="space-y-3">
                <Input
                  id="file"
                  type="file"
                  accept=".txt,.pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  disabled={uploading}
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                        {selectedFile.type.includes('pdf') && ' • PDF'}
                      </p>
                    </div>
                  </div>
                )}
                {formData.content && formData.content.length > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-800">
                      ✓ Đã xử lý thành công - {formData.content.length} ký tự
                    </p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ file .txt và .pdf (tối đa 10MB)
                </p>
              </div>
            </div>
          )}

          {formData.type === 'manual' && (
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Nhập nội dung văn bản pháp luật..."
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Nhập toàn bộ nội dung văn bản pháp luật
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="effectiveDate">Ngày hiệu lực</Label>
            <Input
              id="effectiveDate"
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDialog} disabled={uploading}>
            <X className="h-4 w-4 mr-2" />
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {editingSource ? 'Cập nhật' : 'Thêm mới'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
