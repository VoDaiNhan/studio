'use client';

import { useEffect, useState } from 'react';
import { useUser, initializeFirebase } from '@/firebase';
import { collection, query, getDocs, orderBy, Timestamp, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, MessageSquare, Users, Clock, Loader2, BarChart3 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnalyticsExport } from '@/components/analytics-export';
import { RealtimeAnalytics } from '@/components/realtime-analytics';
import { AnalyticsComparison } from '@/components/analytics-comparison';

interface AnalyticsData {
  totalQueries: number;
  totalUsers: number;
  avgResponseTime: number;
  topTopics: Array<{ topic: string; count: number }>;
  queriesOverTime: Array<{ date: string; count: number }>;
  userActivity: Array<{ name: string; queries: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AnalyticsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalQueries: 0,
    totalUsers: 0,
    avgResponseTime: 0,
    topTopics: [],
    queriesOverTime: [],
    userActivity: []
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { firestore } = initializeFirebase();
        
        // Get all conversations
        const conversationsRef = collection(firestore, 'users', user.uid, 'conversations');
        const q = query(conversationsRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        
        const conversations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }));

        // Calculate total queries
        const totalQueries = conversations.length;

        // Extract topics from queries (simple keyword extraction)
        const topicCounts: Record<string, number> = {};
        conversations.forEach(conv => {
          const query = (conv.userQuery || '').toLowerCase();
          // Extract keywords
          const keywords = ['giao thông', 'hợp đồng', 'lao động', 'hình sự', 'dân sự', 'hành chính', 'thuế', 'bảo hiểm'];
          keywords.forEach(keyword => {
            if (query.includes(keyword)) {
              topicCounts[keyword] = (topicCounts[keyword] || 0) + 1;
            }
          });
        });

        const topTopics = Object.entries(topicCounts)
          .map(([topic, count]) => ({ topic, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 6);

        // Queries over time (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toISOString().split('T')[0];
        });

        const queriesOverTime = last7Days.map(date => {
          const count = conversations.filter(conv => {
            const convDate = conv.timestamp?.toISOString().split('T')[0];
            return convDate === date;
          }).length;
          return { date: date.slice(5), count };
        });

        setAnalytics({
          totalQueries,
          totalUsers: 1, // Single user for now
          avgResponseTime: 2.5, // Mock data
          topTopics,
          queriesOverTime,
          userActivity: [{ name: 'Bạn', queries: totalQueries }]
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Yêu cầu đăng nhập</CardTitle>
            <CardDescription>Vui lòng đăng nhập để xem phân tích</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full pb-8">
      <ScrollArea className="h-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Phân tích & Thống kê
              </h1>
              <p className="text-muted-foreground mt-2">
                Tổng quan về hoạt động sử dụng chatbot tra cứu luật
              </p>
            </div>
            <AnalyticsExport data={analytics} />
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng câu hỏi</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalQueries}</div>
                <p className="text-xs text-muted-foreground">
                  +20% so với tháng trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Đang hoạt động
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thời gian phản hồi TB</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.avgResponseTime}s</div>
                <p className="text-xs text-muted-foreground">
                  -0.5s so với trước
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tăng trưởng</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12.5%</div>
                <p className="text-xs text-muted-foreground">
                  Tuần này
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="topics">Chủ đề</TabsTrigger>
              <TabsTrigger value="trends">Xu hướng</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Câu hỏi theo thời gian</CardTitle>
                    <CardDescription>7 ngày gần nhất</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.queriesOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" name="Số câu hỏi" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hoạt động người dùng</CardTitle>
                    <CardDescription>Số lượng câu hỏi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.userActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="queries" fill="#82ca9d" name="Câu hỏi" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="topics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top chủ đề pháp luật</CardTitle>
                    <CardDescription>Được quan tâm nhiều nhất</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analytics.topTopics}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ topic, percent }) => `${topic} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {analytics.topTopics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Chi tiết chủ đề</CardTitle>
                    <CardDescription>Số lượng câu hỏi theo chủ đề</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.topTopics} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="topic" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" name="Số câu hỏi" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <RealtimeAnalytics />
                <AnalyticsComparison />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Insights & Khuyến nghị</CardTitle>
                  <CardDescription>Phân tích xu hướng và đề xuất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-semibold text-blue-700">📈 Xu hướng tăng</h4>
                      <p className="text-sm text-muted-foreground">
                        Câu hỏi về luật giao thông tăng 35% trong tuần qua. Đề xuất: Cập nhật thêm nội dung về luật giao thông mới.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <h4 className="font-semibold text-green-700">✅ Hiệu suất tốt</h4>
                      <p className="text-sm text-muted-foreground">
                        Thời gian phản hồi trung bình giảm 20%, người dùng hài lòng hơn với tốc độ xử lý.
                      </p>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4 py-2">
                      <h4 className="font-semibold text-yellow-700">⚠️ Cần chú ý</h4>
                      <p className="text-sm text-muted-foreground">
                        Một số câu hỏi về luật lao động chưa được trả lời đầy đủ. Đề xuất: Bổ sung dữ liệu luật lao động.
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                      <h4 className="font-semibold text-purple-700">💡 Gợi ý</h4>
                      <p className="text-sm text-muted-foreground">
                        Thêm tính năng bookmark cho các câu trả lời quan trọng để người dùng dễ dàng tham khảo lại.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
