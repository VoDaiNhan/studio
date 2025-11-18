'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { AdminAccessDenied } from '@/components/admin-access-denied';
import { isAdmin } from '@/middleware/admin-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, Sparkles, History, Eye } from 'lucide-react';
import { getAppearanceConfig, updateAppearanceConfig, type AppearanceConfig } from '@/app/actions/appearance';
import { useToast } from '@/hooks/use-toast';
import { ChatPreview } from '@/components/chat-preview';

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
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Configuration */}
          <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Cấu hình Chatbot</h1>
                <p className="text-muted-foreground mt-1">
                  Tùy chỉnh giao diện, hành vi và kiến thức cho chatbot của bạn.
                </p>
              </div>

              <Tabs defaultValue="interface" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="interface">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Giao diện
                  </TabsTrigger>
                  <TabsTrigger value="behavior">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Hành vi
                  </TabsTrigger>
                  <TabsTrigger value="model">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Model
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
                      <CardTitle>Hành vi & Phản hồi</CardTitle>
                      <CardDescription>
                        Cấu hình cách chatbot xử lý và trả lời câu hỏi
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxTokens">Độ dài câu trả lời tối đa</Label>
                        <Input
                          id="maxTokens"
                          type="number"
                          placeholder="1000"
                          defaultValue="1000"
                        />
                        <p className="text-xs text-muted-foreground">
                          Số token tối đa cho mỗi câu trả lời (1 token ≈ 4 ký tự)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="temperature">Mức độ sáng tạo (Temperature)</Label>
                        <div className="flex items-center gap-4">
                          <input
                            id="temperature"
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            defaultValue="0.3"
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-12">0.3</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          0 = Chính xác, 1 = Sáng tạo. Khuyến nghị: 0.3 cho luật pháp
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="responseStyle">Phong cách trả lời</Label>
                        <Select defaultValue="concise">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="concise">Ngắn gọn (2-3 đoạn)</SelectItem>
                            <SelectItem value="detailed">Chi tiết (4-5 đoạn)</SelectItem>
                            <SelectItem value="comprehensive">Toàn diện (6+ đoạn)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="citeSources">Trích dẫn nguồn</Label>
                        <Select defaultValue="always">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="always">Luôn luôn</SelectItem>
                            <SelectItem value="when-available">Khi có sẵn</SelectItem>
                            <SelectItem value="never">Không bao giờ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fallbackMessage">Tin nhắn dự phòng</Label>
                        <Textarea
                          id="fallbackMessage"
                          placeholder="Xin lỗi, tôi không tìm thấy thông tin liên quan. Vui lòng thử câu hỏi khác."
                          rows={3}
                          defaultValue="Xin lỗi, tôi không tìm thấy thông tin liên quan đến câu hỏi của bạn. Vui lòng thử đặt câu hỏi cụ thể hơn hoặc sử dụng từ khóa khác."
                        />
                        <p className="text-xs text-muted-foreground">
                          Tin nhắn hiển thị khi không tìm thấy câu trả lời
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Giới hạn & Bảo mật</CardTitle>
                      <CardDescription>
                        Cấu hình giới hạn sử dụng và bảo mật
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="rateLimit">Giới hạn số câu hỏi/phút</Label>
                        <Input
                          id="rateLimit"
                          type="number"
                          placeholder="10"
                          defaultValue="10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Số câu hỏi tối đa mỗi người dùng có thể hỏi trong 1 phút
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxQueryLength">Độ dài câu hỏi tối đa</Label>
                        <Input
                          id="maxQueryLength"
                          type="number"
                          placeholder="2000"
                          defaultValue="2000"
                        />
                        <p className="text-xs text-muted-foreground">
                          Số ký tự tối đa cho mỗi câu hỏi
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contentFilter">Lọc nội dung</Label>
                        <Select defaultValue="moderate">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="strict">Nghiêm ngặt</SelectItem>
                            <SelectItem value="moderate">Trung bình</SelectItem>
                            <SelectItem value="permissive">Thoải mái</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Mức độ lọc nội dung không phù hợp
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="model" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cấu hình AI Model</CardTitle>
                      <CardDescription>
                        Chọn và cấu hình model AI cho chatbot
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="aiProvider">Nhà cung cấp AI</Label>
                        <Select defaultValue="google">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="google">Google AI (Gemini)</SelectItem>
                            <SelectItem value="openai">OpenAI (GPT)</SelectItem>
                            <SelectItem value="both">Cả hai (Google ưu tiên)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="googleModel">Google AI Model</Label>
                        <Select defaultValue="gemini-2.5-flash">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash (Khuyến nghị)</SelectItem>
                            <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                            <SelectItem value="gemini-2.0-flash-lite">Gemini 2.0 Flash Lite</SelectItem>
                            <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                            <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                            <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Model được sử dụng khi chọn Google AI
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="openaiModel">OpenAI Model</Label>
                        <Select defaultValue="gpt-4o-mini">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                            <SelectItem value="gpt-4o-mini">GPT-4o Mini (Khuyến nghị)</SelectItem>
                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Model được sử dụng khi chọn OpenAI
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="googleApiKey">Google API Key</Label>
                        <Input
                          id="googleApiKey"
                          type="password"
                          placeholder="AIzaSy..."
                          defaultValue="••••••••••••••••"
                        />
                        <p className="text-xs text-muted-foreground">
                          API key cho Google AI. Để trống nếu không thay đổi.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                        <Input
                          id="openaiApiKey"
                          type="password"
                          placeholder="sk-proj-..."
                          defaultValue="••••••••••••••••"
                        />
                        <p className="text-xs text-muted-foreground">
                          API key cho OpenAI. Để trống nếu không thay đổi.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-sm mb-2 text-blue-900">💡 Gợi ý</h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• <strong>Gemini 2.5 Flash</strong>: Nhanh, chính xác, chi phí thấp (khuyến nghị)</li>
                          <li>• <strong>Gemini 2.5 Pro</strong>: Mạnh nhất, phù hợp câu hỏi phức tạp</li>
                          <li>• <strong>GPT-4o Mini</strong>: Cân bằng giữa chất lượng và chi phí</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tối ưu hóa</CardTitle>
                      <CardDescription>
                        Cấu hình để tối ưu hiệu suất và chi phí
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cacheEnabled">Bật cache kết quả</Label>
                        <Select defaultValue="enabled">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enabled">Bật (Khuyến nghị)</SelectItem>
                            <SelectItem value="disabled">Tắt</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Cache câu trả lời cho câu hỏi tương tự để giảm chi phí
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cacheDuration">Thời gian cache (phút)</Label>
                        <Input
                          id="cacheDuration"
                          type="number"
                          placeholder="60"
                          defaultValue="60"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxDocuments">Số tài liệu tối đa</Label>
                        <Input
                          id="maxDocuments"
                          type="number"
                          placeholder="3"
                          defaultValue="3"
                        />
                        <p className="text-xs text-muted-foreground">
                          Số tài liệu liên quan tối đa được gửi cho AI (1-5)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Lịch sử thay đổi</CardTitle>
                      <CardDescription>
                        Xem lịch sử các thay đổi cấu hình
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { date: '2024-01-15 14:30', user: 'Admin', change: 'Thay đổi màu chính thành #2563EB' },
                          { date: '2024-01-14 10:20', user: 'Admin', change: 'Cập nhật lời chào mặc định' },
                          { date: '2024-01-13 16:45', user: 'Admin', change: 'Chuyển sang Google AI Gemini 2.5 Flash' },
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.change}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.user} • {item.date}
                              </p>
                            </div>
                          </div>
                        ))}
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

          {/* Right side - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Xem trước</h2>
              </div>
              <div className="h-[600px]">
                <ChatPreview config={config} />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Thay đổi sẽ được hiển thị ngay lập tức
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
