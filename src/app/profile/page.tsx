'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfileCard } from '@/components/user-profile-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Star, Clock, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

interface UserStats {
  totalQueries: number;
  totalBookmarks: number;
  avgResponseTime: number;
  mostUsedTopic: string;
}

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({
    totalQueries: 0,
    totalBookmarks: 0,
    avgResponseTime: 2.5,
    mostUsedTopic: 'Luật Giao thông',
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) return;

      try {
        const { firestore } = initializeFirebase();
        const conversationsRef = collection(firestore, 'users', user.uid, 'conversations');
        const q = query(conversationsRef, orderBy('timestamp', 'desc'), limit(10));
        const snapshot = await getDocs(q);

        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        }));

        setRecentActivity(activities);
        setStats(prev => ({
          ...prev,
          totalQueries: snapshot.size,
        }));
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    };

    loadUserStats();
  }, [user]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Yêu cầu đăng nhập</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/login')} className="w-full">
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full pb-8">
      <ScrollArea className="h-full">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Hồ sơ của tôi</h1>
            <p className="text-muted-foreground mt-2">
              Xem thông tin và hoạt động của bạn
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Column - Profile Card */}
            <div className="md:col-span-1">
              <UserProfileCard />
            </div>

            {/* Right Column - Stats & Activity */}
            <div className="md:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Tổng câu hỏi
                    </CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalQueries}</div>
                    <p className="text-xs text-muted-foreground">
                      +20% so với tháng trước
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Đã lưu
                    </CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalBookmarks}</div>
                    <p className="text-xs text-muted-foreground">
                      Câu trả lời quan trọng
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Thời gian TB
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.avgResponseTime}s</div>
                    <p className="text-xs text-muted-foreground">
                      Phản hồi trung bình
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Chủ đề phổ biến
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{stats.mostUsedTopic}</div>
                    <p className="text-xs text-muted-foreground">
                      Được hỏi nhiều nhất
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="queries">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="queries">Câu hỏi</TabsTrigger>
                      <TabsTrigger value="bookmarks">Đã lưu</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="queries" className="space-y-4 mt-4">
                      {recentActivity.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Chưa có hoạt động nào
                        </p>
                      ) : (
                        recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.userQuery}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {activity.timestamp?.toLocaleDateString('vi-VN')} - {activity.timestamp?.toLocaleTimeString('vi-VN')}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </TabsContent>

                    <TabsContent value="bookmarks" className="space-y-4 mt-4">
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Chưa có câu trả lời nào được lưu
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
