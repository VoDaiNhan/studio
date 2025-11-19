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
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 w-full max-w-full box-border">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Tài khoản & Cài đặt</h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Quản lý thông tin tài khoản và cài đặt hệ thống
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                    Thông tin tài khoản
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Cập nhật thông tin cá nhân của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar className="h-16 w-16 md:h-20 md:w-20">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" className="w-full sm:w-auto text-sm">Thay đổi ảnh đại diện</Button>
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="text-sm">Tên hiển thị</Label>
                      <Input
                        id="displayName"
                        defaultValue={user.displayName || ''}
                        placeholder="Nhập tên của bạn"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email || ''}
                        disabled
                        className="text-sm"
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
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Bell className="h-4 w-4 md:h-5 md:w-5" />
                    Thông báo
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Quản lý cài đặt thông báo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5 flex-1">
                      <Label className="text-sm">Thông báo qua Email</Label>
                      <p className="text-xs md:text-sm text-muted-foreground">
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

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5 flex-1">
                      <Label className="text-sm">Báo cáo hàng tuần</Label>
                      <p className="text-xs md:text-sm text-muted-foreground">
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

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5 flex-1">
                      <Label className="text-sm">Cảnh báo bảo mật</Label>
                      <p className="text-xs md:text-sm text-muted-foreground">
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
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Shield className="h-4 w-4 md:h-5 md:w-5" />
                    Bảo mật
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Quản lý cài đặt bảo mật tài khoản
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full sm:w-auto text-sm">Đổi mật khẩu</Button>
                  <Button variant="outline" className="w-full sm:w-auto text-sm">Xem lịch sử đăng nhập</Button>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
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
