'use client';

import { useEffect, useState } from 'react';
import { useUser, initializeFirebase } from '@/firebase';
import { collection, query, getDocs, orderBy, where, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, MessageSquare, Users, Clock, Loader2, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AdminAnalyticsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full pt-16 pb-8">
      <ScrollArea className="h-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-primary" />
                Admin Analytics Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Phân tích chi tiết và insights cho quản trị viên
              </p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 ngày qua</SelectItem>
                <SelectItem value="30d">30 ngày qua</SelectItem>
                <SelectItem value="90d">90 ngày qua</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng câu hỏi</CardTitle>
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  +20.1% so với kỳ trước
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ thành công</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">95.2%</div>
                <p className="text-xs text-muted-foreground">
                  Câu trả lời chính xác
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thời gian TB</CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3s</div>
                <p className="text-xs text-muted-foreground">
                  -0.5s cải thiện
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  Đang hoạt động
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Admin Analytics - Coming Soon</CardTitle>
              <CardDescription>Tính năng phân tích nâng cao đang được phát triển</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dashboard admin với các tính năng phân tích chi tiết sẽ sớm được ra mắt.
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
