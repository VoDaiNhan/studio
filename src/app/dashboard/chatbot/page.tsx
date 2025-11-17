'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AppHeader } from '@/components/app-header';
import { AdminAccessDenied } from '@/components/admin-access-denied';
import { isAdmin } from '@/middleware/admin-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Sparkles, History } from 'lucide-react';
import { getAppearanceConfig, updateAppearanceConfig, type AppearanceConfig } from '@/app/actions/appearance';
import { useToast } from '@/hooks/use-toast';

export default function ChatbotConfigPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<AppearanceConfig | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push('/login');
    }
  }, [user, authLoading, router, mounted]);

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await getAppearanceConfig();
        setConfig(data);
      } catch (error) {
        console.error('Failed to load config:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải cấu hình',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      loadConfig();
    }
  }, [user, toast]);

  const handleSave = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      const result = await updateAppearanceConfig(config);
      if (result.success) {
        toast({
          title: 'Thành công',
          description: 'Đã lưu cấu hình chatbot',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu cấu hình',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading || !mounted || !config) {
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
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Cấu hình Chatbot</h1>
                <p className="text-muted-foreground mt-1">
                  Tùy chỉnh giao diện, hành vi và kiến thức cho chatbot của bạn.
                </p>
              </div>

              <Tabs defaultValue="interface" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="interface">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Giao diện
                  </TabsTrigger>
                  <TabsTrigger value="behavior">
                    <History className="h-4 w-4 mr-2" />
                    Kiến thức
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <History className="h-4 w-4 mr-2" />
                    Lịch sử
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="interface" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Giao diện</CardTitle>
                      <CardDescription>
                        Tùy chỉnh giao diện và cảm nhận của chatbot
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Tên hiển thị</Label>
                        <Input
                          id="displayName"
                          value={config.displayName}
                          onChange={(e) => setConfig({ ...config, displayName: e.target.value })}
                          placeholder="Trợ lý Luật Giao thông"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tên này sẽ được hiển thị cho người dùng cuối.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="welcomeMessage">Lời chào</Label>
                        <Textarea
                          id="welcomeMessage"
                          value={config.welcomeMessage}
                          onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                          placeholder="Chào bạn! Tôi có thể giúp gì cho bạn về Luật Giao thông?"
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          Tin nhắn đầu tiên chatbot sẽ gửi.
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="primaryColor">Màu chính</Label>
                          <div className="flex gap-2">
                            <Input
                              id="primaryColor"
                              type="color"
                              value={config.primaryColor}
                              onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                              className="w-16 h-10"
                            />
                            <Input
                              value={config.primaryColor}
                              onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                              placeholder="#2563EB"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accentColor">Màu phụ</Label>
                          <div className="flex gap-2">
                            <Input
                              id="accentColor"
                              type="color"
                              value={config.accentColor}
                              onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                              className="w-16 h-10"
                            />
                            <Input
                              value={config.accentColor}
                              onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                              placeholder="#FBBF24"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="backgroundColor">Màu nền</Label>
                          <div className="flex gap-2">
                            <Input
                              id="backgroundColor"
                              type="color"
                              value={config.backgroundColor}
                              onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                              className="w-16 h-10"
                            />
                            <Input
                              value={config.backgroundColor}
                              onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                              placeholder="#F3F4F6"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="aiPersona">Phong cách AI</Label>
                        <Select
                          value={config.aiPersona}
                          onValueChange={(value: 'expert' | 'friendly' | 'professional') =>
                            setConfig({ ...config, aiPersona: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="expert">Chuyên gia</SelectItem>
                            <SelectItem value="friendly">Thân thiện</SelectItem>
                            <SelectItem value="professional">Chuyên nghiệp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="behavior" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Kiến thức</CardTitle>
                      <CardDescription>
                        Quản lý nguồn kiến thức và cách chatbot trả lời
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Tính năng quản lý kiến thức sẽ được thêm vào phần "Quản lý Kiến thức"</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Lịch sử</CardTitle>
                      <CardDescription>
                        Xem lịch sử thay đổi cấu hình
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Lịch sử cấu hình sẽ được hiển thị ở đây</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
