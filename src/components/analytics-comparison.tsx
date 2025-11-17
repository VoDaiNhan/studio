'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface ComparisonData {
  metric: string;
  current: number;
  previous: number;
  unit: string;
}

const comparisonData: ComparisonData[] = [
  { metric: 'Tổng câu hỏi', current: 1234, previous: 1028, unit: '' },
  { metric: 'Người dùng mới', current: 156, previous: 142, unit: '' },
  { metric: 'Thời gian phản hồi', current: 2.3, previous: 2.8, unit: 's' },
  { metric: 'Tỷ lệ thành công', current: 95.2, previous: 93.8, unit: '%' },
  { metric: 'Độ hài lòng', current: 4.6, previous: 4.4, unit: '/5' },
  { metric: 'Câu hỏi/người dùng', current: 7.9, previous: 7.2, unit: '' },
];

export function AnalyticsComparison() {
  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0,
      isNegative: change < 0,
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          So sánh theo thời gian
        </CardTitle>
        <CardDescription>So sánh với kỳ trước</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Tuần</TabsTrigger>
            <TabsTrigger value="month">Tháng</TabsTrigger>
            <TabsTrigger value="quarter">Quý</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week" className="space-y-3 mt-4">
            {comparisonData.map((item, idx) => {
              const change = calculateChange(item.current, item.previous);
              return (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.metric}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold">
                        {item.current}{item.unit}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        vs {item.previous}{item.unit}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant={change.isPositive ? "default" : change.isNegative ? "destructive" : "secondary"}
                    className="gap-1"
                  >
                    {change.isPositive && <ArrowUpRight className="h-3 w-3" />}
                    {change.isNegative && <ArrowDownRight className="h-3 w-3" />}
                    {change.value}%
                  </Badge>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="month" className="space-y-3 mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>Dữ liệu so sánh theo tháng</p>
              <p className="text-sm">Tính năng đang được phát triển</p>
            </div>
          </TabsContent>

          <TabsContent value="quarter" className="space-y-3 mt-4">
            <div className="text-center py-8 text-muted-foreground">
              <p>Dữ liệu so sánh theo quý</p>
              <p className="text-sm">Tính năng đang được phát triển</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
