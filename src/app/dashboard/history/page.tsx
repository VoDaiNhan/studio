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
import { Loader2, Search, MessageSquare, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockConversations = [
  {
    id: 1,
    user: 'Nguyễn Văn A',
    query: 'Tốc độ tối đa trên đường cao tốc là bao nhiêu?',
    response: 'Tốc độ tối đa cho phép đối với xe ô tô trên đường cao tốc là 120 km/h...',
    timestamp: '2024-01-15 14:30',
    verified: true,
    rating: 5,
  },
  {
    id: 2,
    user: 'Trần Thị B',
    query: 'Phạt bao nhiêu khi không đội mũ bảo hiểm?',
    response: 'Theo Nghị định 100/2019/NĐ-CP, mức phạt từ 400.000đ đến 600.000đ...',
    timestamp: '2024-01-15 13:15',
    verified: true,
    rating: 4,
  },
  {
    id: 3,
    user: 'Lê Văn C',
    query: 'Điều kiện để được cấp bằng lái xe A1?',
    response: 'Để được cấp bằng lái xe A1, người xin cấp phải đủ 16 tuổi trở lên...',
    timestamp: '2024-01-15 12:00',
    verified: false,
    rating: 3,
  },
];

export default function HistoryPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [conversations, setConversations] = useState(mockConversations);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push('/login');
    }
  }, [user, authLoading, router, mounted]);

  const handleSearch = () => {
    let filtered = mockConversations;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (conv) =>
          conv.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((conv) =>
        filterStatus === 'verified' ? conv.verified : !conv.verified
      );
    }

    setConversations(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [filterStatus]);

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
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 w-full max-w-full box-border">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Lịch sử Trò chuyện</h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Xem và quản lý lịch sử các cuộc trò chuyện
                </p>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base md:text-lg">Tìm kiếm và lọc</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Tìm kiếm theo người dùng hoặc nội dung câu hỏi
                      </CardDescription>
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="verified">Đã xác minh</SelectItem>
                        <SelectItem value="unverified">Chưa xác minh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Tìm kiếm theo người dùng hoặc câu hỏi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} className="w-full sm:w-auto">
                      <Search className="h-4 w-4 sm:mr-2" />
                      <span className="sm:inline">Tìm kiếm</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">Danh sách cuộc trò chuyện</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Tìm thấy {conversations.length} cuộc trò chuyện
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] md:h-[600px]">
                    <div className="space-y-3 md:space-y-4">
                      {conversations.map((conv) => (
                        <Card key={conv.id}>
                          <CardHeader className="p-4">
                            <div className="flex flex-col gap-3">
                              <div className="space-y-2 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-sm md:text-base">{conv.user}</span>
                                  {conv.verified && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                                      Đã xác minh
                                    </Badge>
                                  )}
                                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                    {'★'.repeat(conv.rating)}
                                    {'☆'.repeat(5 - conv.rating)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {conv.timestamp}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 p-4 pt-0">
                            <div>
                              <div className="flex items-start gap-2 mb-1">
                                <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="font-medium text-xs md:text-sm">Câu hỏi:</span>
                              </div>
                              <p className="text-xs md:text-sm ml-6">{conv.query}</p>
                            </div>
                            <div>
                              <div className="flex items-start gap-2 mb-1">
                                <MessageSquare className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="font-medium text-xs md:text-sm">Trả lời:</span>
                              </div>
                              <p className="text-xs md:text-sm text-muted-foreground ml-6">{conv.response}</p>
                            </div>
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
