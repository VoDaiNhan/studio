'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AppHeader } from '@/components/app-header';
import { AdminAccessDenied } from '@/components/admin-access-denied';
import { isAdmin } from '@/middleware/admin-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Search, FileText, Trash2, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const mockKnowledge = [
  { id: 1, title: 'Luật Giao thông đường bộ 2024', type: 'Văn bản pháp luật', articles: 85, updated: '2024-01-15' },
  { id: 2, title: 'Nghị định 100/2019/NĐ-CP', type: 'Nghị định', articles: 42, updated: '2023-12-20' },
  { id: 3, title: 'Thông tư 65/2020/TT-BCA', type: 'Thông tư', articles: 28, updated: '2023-11-10' },
];

export default function KnowledgePage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push('/login');
    }
  }, [user, authLoading, router, mounted]);

  if (authLoading || !mounted) {
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
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Quản lý Kiến thức</h1>
                  <p className="text-muted-foreground mt-1">
                    Thêm, chỉnh sửa và quản lý nguồn kiến thức cho chatbot
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm tài liệu
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
                        <TableHead>Tên tài liệu</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Số điều khoản</TableHead>
                        <TableHead>Cập nhật</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockKnowledge.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              {doc.title}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.type}</Badge>
                          </TableCell>
                          <TableCell>{doc.articles} điều</TableCell>
                          <TableCell>{doc.updated}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
      </Card>
      </div>
    </div>
  );
}
