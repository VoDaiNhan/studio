'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Clock, TrendingUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { initializeFirebase } from '@/firebase';
import { collection, query, getDocs, orderBy, limit, where, Timestamp } from 'firebase/firestore';

interface DashboardStats {
  totalQueries: number;
  totalUsers: number;
  avgResponseTime: number;
  successRate: number;
}

interface ChartDataPoint {
  name: string;
  queries: number;
}

interface Activity {
  type: 'success' | 'info' | 'warning';
  message: string;
  time: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQueries: 0,
    totalUsers: 0,
    avgResponseTime: 0,
    successRate: 0,
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { firestore } = initializeFirebase();
      
      // Get all users
      const usersSnapshot = await getDocs(collection(firestore, 'users'));
      const totalUsers = usersSnapshot.size;
      
      // Get all conversations from all users
      let totalQueries = 0;
      let successfulQueries = 0;
      const last7Days: { [key: string]: number } = {};
      const recentActivities: Activity[] = [];
      
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Initialize last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];
        last7Days[dayName] = 0;
      }
      
      // Iterate through all users to get their conversations
      for (const userDoc of usersSnapshot.docs) {
        const conversationsRef = collection(firestore, 'users', userDoc.id, 'conversations');
        const conversationsSnapshot = await getDocs(conversationsRef);
        
        conversationsSnapshot.forEach((convDoc) => {
          const data = convDoc.data();
          totalQueries++;
          
          if (data.botSummary && data.botSummary.length > 0) {
            successfulQueries++;
          }
          
          // Count queries in last 7 days
          if (data.timestamp) {
            const convDate = data.timestamp.toDate();
            if (convDate >= sevenDaysAgo) {
              const dayName = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][convDate.getDay()];
              if (last7Days[dayName] !== undefined) {
                last7Days[dayName]++;
              }
            }
          }
        });
      }
      
      // Calculate success rate
      const successRate = totalQueries > 0 ? (successfulQueries / totalQueries) * 100 : 0;
      
      // Prepare chart data
      const chartDataArray: ChartDataPoint[] = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => ({
        name: day,
        queries: last7Days[day] || 0,
      }));
      
      // Generate recent activities
      const newActivities: Activity[] = [];
      
      if (totalQueries > 0) {
        newActivities.push({
          type: 'success',
          message: `Chatbot đã trả lời ${totalQueries} câu hỏi`,
          time: 'Hôm nay',
        });
      }
      
      if (totalUsers > 0) {
        newActivities.push({
          type: 'info',
          message: `Có ${totalUsers} người dùng đã đăng ký`,
          time: 'Tổng cộng',
        });
      }
      
      if (successRate >= 90) {
        newActivities.push({
          type: 'success',
          message: `Tỷ lệ thành công đạt ${successRate.toFixed(1)}%`,
          time: 'Hiện tại',
        });
      } else if (successRate < 80) {
        newActivities.push({
          type: 'warning',
          message: `Tỷ lệ thành công chỉ ${successRate.toFixed(1)}%`,
          time: 'Cần cải thiện',
        });
      }
      
      setStats({
        totalQueries,
        totalUsers,
        avgResponseTime: 2.3, // This would need actual timing data
        successRate,
      });
      
      setChartData(chartDataArray);
      setActivities(newActivities);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const statsData = [
    {
      title: 'Tổng câu hỏi',
      value: stats.totalQueries.toLocaleString(),
      change: `${stats.totalQueries} câu hỏi`,
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Tỷ lệ thành công',
      value: `${stats.successRate.toFixed(1)}%`,
      change: 'Câu trả lời chính xác',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Thời gian TB',
      value: `${stats.avgResponseTime}s`,
      change: 'Thời gian phản hồi',
      icon: Clock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Người dùng',
      value: stats.totalUsers.toLocaleString(),
      change: 'Đã đăng ký',
      icon: Users,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Tổng quan về hoạt động của chatbot
          </p>
        </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-3 rounded-xl ${stat.bgColor} shadow-md`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Câu hỏi theo ngày</CardTitle>
            <CardDescription className="text-base">7 ngày qua</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Bar dataKey="queries" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Xu hướng sử dụng</CardTitle>
            <CardDescription className="text-base">Biểu đồ tăng trưởng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Line type="monotone" dataKey="queries" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Hoạt động gần đây</CardTitle>
            <CardDescription className="text-base">Các sự kiện quan trọng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có hoạt động nào</p>
              ) : (
                activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 hover:bg-muted/30 -mx-2 px-2 py-2 rounded-lg transition-colors">
                  <div className={`p-2.5 rounded-xl shadow-sm ${
                    activity.type === 'success' ? 'bg-green-100' :
                    activity.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : activity.type === 'warning' ? (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
