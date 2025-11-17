'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RealtimeMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export function RealtimeAnalytics() {
  const [metrics, setMetrics] = useState<RealtimeMetric[]>([
    { label: 'Câu hỏi/phút', value: 12, change: 5.2, trend: 'up' },
    { label: 'Người dùng online', value: 45, change: -2.1, trend: 'down' },
    { label: 'Thời gian phản hồi', value: 2.3, change: 0, trend: 'stable' },
    { label: 'Tỷ lệ thành công', value: 95.8, change: 1.5, trend: 'up' },
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 2,
        change: (Math.random() - 0.5) * 5,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          Real-time Analytics
        </CardTitle>
        <CardDescription>Cập nhật trực tiếp mỗi 5 giây</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, idx) => (
            <div key={idx} className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{metric.label}</span>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="text-2xl font-bold">{metric.value.toFixed(1)}</div>
              <div className={`text-xs flex items-center gap-1 mt-1 ${getTrendColor(metric.trend)}`}>
                {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center">
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Live
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
