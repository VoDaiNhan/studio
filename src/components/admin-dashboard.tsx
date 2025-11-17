'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const statsData = [
  {
    title: 'Tổng câu hỏi',
    value: '1,234',
    change: '+20.1%',
    icon: MessageSquare,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Tỷ lệ thành công',
    value: '95.2%',
    change: 'Câu trả lời chính xác',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Thời gian TB',
    value: '2.3s',
    change: '-0.5s cải thiện',
    icon: Clock,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Người dùng',
    value: '156',
    change: 'Đang hoạt động',
    icon: Users,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
];

const chartData = [
  { name: 'T2', queries: 65 },
  { name: 'T3', queries: 78 },
  { name: 'T4', queries: 90 },
  { name: 'T5', queries: 81 },
  { name: 'T6', queries: 95 },
  { name: 'T7', queries: 72 },
  { name: 'CN', queries: 58 },
];

export function AdminDashboard() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
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
              {[
                { type: 'success', message: 'Chatbot đã trả lời 50 câu hỏi thành công', time: '5 phút trước' },
                { type: 'info', message: 'Có 3 người dùng mới đăng ký', time: '15 phút trước' },
                { type: 'warning', message: 'Thời gian phản hồi tăng nhẹ', time: '1 giờ trước' },
              ].map((activity, index) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
