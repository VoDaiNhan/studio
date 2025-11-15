'use client';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MessageSquare, Calendar, User, Bot, Loader2, RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Conversation {
  id: string;
  userQuery: string;
  botSummary: string;
  sourceArticles?: string;
  timestamp: any;
  userId: string;
}

export default function HistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { user } = useUser();

  const loadConversations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { firestore } = initializeFirebase();
      // Read from users/{userId}/conversations subcollection
      const userConversationsCol = collection(firestore, 'users', user.uid, 'conversations');
      
      // Simple query with orderBy - no composite index needed for subcollection
      const q = query(
        userConversationsCol,
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        userId: user.uid,
        ...doc.data()
      })) as Conversation[];
      
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  const filteredConversations = conversations.filter(conv =>
    conv.userQuery.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.botSummary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Không rõ';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">Vui lòng đăng nhập để xem lịch sử trò chuyện</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Lịch sử trò chuyện</h1>
        <p className="text-muted-foreground">
          Xem lại các cuộc hội thoại trước đây với trợ lý AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Danh sách cuộc hội thoại</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={loadConversations}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có cuộc hội thoại nào'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedConversation?.id === conv.id
                            ? 'bg-primary/10 border border-primary'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <p className="font-medium text-sm line-clamp-2 mb-1">
                          {conv.userQuery}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(conv.timestamp)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết cuộc hội thoại</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedConversation.timestamp)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-1 text-sm text-muted-foreground">Câu hỏi của bạn</p>
                      <div className="bg-blue-500 text-white rounded-lg p-4">
                        <p>{selectedConversation.userQuery}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-1 text-sm text-muted-foreground">Trả lời từ AI</p>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="whitespace-pre-wrap">{selectedConversation.botSummary}</p>
                        {selectedConversation.sourceArticles && (
                          <>
                            <Separator className="my-4" />
                            <div className="text-sm">
                              <p className="font-semibold mb-2">Nguồn tham khảo:</p>
                              <p className="text-muted-foreground">{selectedConversation.sourceArticles}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-24 text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  Chọn một cuộc hội thoại để xem chi tiết
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
