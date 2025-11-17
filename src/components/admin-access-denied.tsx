'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AdminAccessDenied() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <ShieldAlert className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Truy cập bị từ chối</CardTitle>
          <CardDescription>
            Bạn không có quyền truy cập vào trang quản trị này.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Chỉ tài khoản quản trị viên mới có thể truy cập trang này.
            Vui lòng liên hệ với quản trị viên nếu bạn cần quyền truy cập.
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push('/dashboard')}
            >
              Về Dashboard
            </Button>
            <Button 
              className="flex-1"
              onClick={() => router.push('/chat')}
            >
              Về Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
