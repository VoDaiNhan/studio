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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const mockArticles = [
  {
    id: 1,
    article: 'Điều 5',
    title: 'Quy tắc giao thông đường bộ',
    content: 'Người tham gia giao thông đường bộ phải tuân thủ quy tắc giao thông, chấp hành hiệu lệnh, chỉ dẫn của người điều khiển giao thông, báo hiệu đường bộ...',
    document: 'Luật Giao thông đường bộ 2024',
  },
  {
    id: 2,
    article: 'Điều 23',
    title: 'Tốc độ tối đa cho phép',
    content: 'Tốc độ tối đa cho phép đối với xe ô tô trên đường cao tốc là 120 km/h, trên đường quốc lộ là 90 km/h...',
    document: 'Luật Giao thông đường bộ 2024',
  },
];

export default function LookupPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(mockArticles);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push('/login');
    }
  }, [user, authLoading, router, mounted]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filtered = mockArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.article.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(mockArticles);
    }
  };

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
              <div>
                <h1 className="text-3xl font-bold">Tra cứu Điều khoản</h1>
                <p className="text-muted-foreground mt-1">
                  Tìm kiếm và tra cứu các điều khoản trong văn bản pháp luật
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tìm kiếm</CardTitle>
                  <CardDescription>
                    Nhập từ khóa để tìm kiếm điều khoản
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập từ khóa tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Tìm kiếm
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kết quả tìm kiếm</CardTitle>
                  <CardDescription>
                    Tìm thấy {results.length} kết quả
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {results.map((article) => (
                        <Card key={article.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{article.article}</Badge>
                                  <CardTitle className="text-lg">{article.title}</CardTitle>
                                </div>
                                <CardDescription className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  {article.document}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{article.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
      </Card>
      </div>
    </div>
  );
}
