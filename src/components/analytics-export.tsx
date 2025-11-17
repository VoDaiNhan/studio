'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsExportProps {
  data: any;
}

export function AnalyticsExport({ data }: AnalyticsExportProps) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setExporting(true);
    
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (exportFormat === 'csv') {
        exportToCSV();
      } else if (exportFormat === 'json') {
        exportToJSON();
      } else if (exportFormat === 'pdf') {
        exportToPDF();
      }
      
      toast({
        title: 'Xuất dữ liệu thành công',
        description: `Dữ liệu đã được xuất ra file ${exportFormat.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: 'Lỗi xuất dữ liệu',
        description: 'Đã có lỗi xảy ra khi xuất dữ liệu',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Queries', data.totalQueries || 0],
      ['Total Users', data.totalUsers || 0],
      ['Avg Response Time', data.avgResponseTime || 0],
      ['Success Rate', data.successRate || 0],
    ].map(row => row.join(',')).join('\n');

    downloadFile(csvContent, 'analytics-report.csv', 'text/csv');
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'analytics-report.json', 'application/json');
  };

  const exportToPDF = () => {
    // Mock PDF export - in production, use a library like jsPDF
    const pdfContent = `Analytics Report\n\nTotal Queries: ${data.totalQueries}\nTotal Users: ${data.totalUsers}`;
    downloadFile(pdfContent, 'analytics-report.pdf', 'application/pdf');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xuất báo cáo phân tích</DialogTitle>
          <DialogDescription>
            Chọn định dạng file để xuất dữ liệu phân tích
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Định dạng file</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Excel)
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Nội dung báo cáo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1">
                <li>Tổng quan thống kê</li>
                <li>Biểu đồ xu hướng</li>
                <li>Top chủ đề pháp luật</li>
                <li>Phân tích người dùng</li>
                <li>Insights và khuyến nghị</li>
              </ul>
            </CardContent>
          </Card>

          <Button 
            onClick={handleExport} 
            disabled={exporting}
            className="w-full"
          >
            {exporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xuất...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Xuất báo cáo
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
