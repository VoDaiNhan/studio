'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AppHeader } from '@/components/app-header';
import { AdminAccessDenied } from '@/components/admin-access-denied';
import { isAdmin } from '@/middleware/admin-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save, User, Mail, Shield, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SettingsPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyReport: true,
    securityAlerts: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push('/login');
    }
  }, [user, authLoading, router, mounted]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  if (authLoading || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin(user)) {
    return <AdminAccessDenied />;
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-8 space-y-8">
              <div>
                <h1 className="text-3xl font-bold">Tài khoản & Cài đặt</h1>
                <p className="text-muted-foreground mt-1">
                  Quản lý thông tin tài khoản và cài đặt hệ thống
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin tài khoản
                  </CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cá nhân của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Thay đổi ảnh đại diện</Button>
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Tên hiển thị</Label>
                      <Input
                        id="displayName"
                        defaultValue={user.displayName || ''}
                        placeholder="Nhập tên của bạn"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email || ''}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Email không thể thay đổi
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Thông báo
                  </CardTitle>
                  <CardDescription>
                    Quản lý cài đặt thông báo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Thông báo qua Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo về hoạt động quan trọng
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, emailNotifications: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Báo cáo hàng tuần</Label>
                      <p className="text-sm text-muted-foreground">
                        Nhận báo cáo tổng hợp hàng tuần
                      </p>
                    </div>
                    <Switch
                      checked={settings.weeklyReport}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, weeklyReport: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cảnh báo bảo mật</Label>
                      <p className="text-sm text-muted-foreground">
                        Nhận thông báo về các vấn đề bảo mật
                      </p>
                    </div>
                    <Switch
                      checked={settings.securityAlerts}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, securityAlerts: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Bảo mật
                  </CardTitle>
                  <CardDescription>
                    Quản lý cài đặt bảo mật tài khoản
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline">Đổi mật khẩu</Button>
                  <Button variant="outline">Xem lịch sử đăng nhập</Button>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
      </div>
      </div>
    </div>
  );
}
