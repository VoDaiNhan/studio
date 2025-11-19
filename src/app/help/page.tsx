'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HelpCircle, MessageSquare, Book, Video, Mail, Phone, Search } from 'lucide-react';
import { useState } from 'react';
import { ChatSidebar } from '@/components/chat-sidebar';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'Làm thế nào để đặt câu hỏi cho chatbot?',
      answer: 'Vào trang Chat, nhập câu hỏi của bạn vào ô input và nhấn nút gửi. Chatbot sẽ phân tích và trả lời dựa trên cơ sở dữ liệu pháp luật.',
    },
    {
      question: 'Tôi có thể thay đổi mật khẩu ở đâu?',
      answer: 'Vào Cài đặt > Tab Bảo mật, nhập mật khẩu hiện tại và mật khẩu mới, sau đó nhấn "Đổi mật khẩu".',
    },
    {
      question: 'Làm sao để xem lịch sử trò chuyện?',
      answer: 'Click vào "Lịch sử trò chuyện" trong sidebar hoặc truy cập /history. Bạn có thể xem tất cả các cuộc hội thoại trước đó.',
    },
    {
      question: 'Chatbot có thể trả lời về tất cả các loại luật không?',
      answer: 'Chatbot được đào tạo trên nhiều lĩnh vực pháp luật Việt Nam. Tuy nhiên, độ chính xác phụ thuộc vào dữ liệu đã được cập nhật trong hệ thống.',
    },
    {
      question: 'Làm thế nào để xuất báo cáo phân tích?',
      answer: 'Vào trang Analytics, click nút "Xuất báo cáo" ở góc trên bên phải, chọn định dạng (CSV/JSON/PDF) và tải xuống.',
    },
    {
      question: 'Tôi có thể tùy chỉnh giao diện không?',
      answer: 'Có, admin có thể tùy chỉnh màu sắc, logo và thông điệp chào mừng trong Dashboard > Tab Giao diện.',
    },
    {
      question: 'Làm sao để thêm nguồn kiến thức mới?',
      answer: 'Vào Dashboard > Tab Kiến thức, click "Thêm nguồn", chọn loại (URL/File/Manual), nhập thông tin và lưu.',
    },
    {
      question: 'Tài khoản của tôi có được bảo mật không?',
      answer: 'Có, chúng tôi sử dụng Firebase Authentication với mã hóa end-to-end. Bạn cũng có thể bật xác thực 2FA để tăng cường bảo mật.',
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <ChatSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-5xl">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <HelpCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                Trung tâm trợ giúp
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Tìm câu trả lời cho các câu hỏi thường gặp và nhận hỗ trợ
              </p>
            </div>

            <Tabs defaultValue="faq" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="faq" className="text-xs md:text-sm">
                  <Book className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="guides" className="text-xs md:text-sm">
                  <Video className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Hướng dẫn
                </TabsTrigger>
                <TabsTrigger value="contact" className="text-xs md:text-sm">
                  <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Liên hệ
                </TabsTrigger>
                <TabsTrigger value="resources" className="text-xs md:text-sm">
                  <Book className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Tài liệu
                </TabsTrigger>
              </TabsList>

              {/* FAQ Tab */}
              <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle>Câu hỏi thường gặp</CardTitle>
                  <CardDescription>
                    Tìm câu trả lời nhanh cho các câu hỏi phổ biến
                  </CardDescription>
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm câu hỏi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {filteredFaqs.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Không tìm thấy câu hỏi phù hợp
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

              {/* Guides Tab */}
              <TabsContent value="guides">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Bắt đầu nhanh</CardTitle>
                    <CardDescription>
                      Hướng dẫn sử dụng cơ bản cho người mới
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Đăng ký và đăng nhập</li>
                      <li>• Đặt câu hỏi đầu tiên</li>
                      <li>• Xem lịch sử trò chuyện</li>
                      <li>• Tùy chỉnh cài đặt</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Quản lý tài khoản</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin và bảo mật
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Chỉnh sửa hồ sơ</li>
                      <li>• Đổi mật khẩu</li>
                      <li>• Cài đặt thông báo</li>
                      <li>• Bảo mật tài khoản</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Sử dụng Analytics</CardTitle>
                    <CardDescription>
                      Xem và phân tích dữ liệu
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Xem dashboard</li>
                      <li>• Phân tích xu hướng</li>
                      <li>• Xuất báo cáo</li>
                      <li>• Hiểu insights</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Tùy chỉnh giao diện</CardTitle>
                    <CardDescription>
                      Cá nhân hóa trải nghiệm
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Thay đổi màu sắc</li>
                      <li>• Upload logo</li>
                      <li>• Chọn theme</li>
                      <li>• Cài đặt ngôn ngữ</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Gửi yêu cầu hỗ trợ</CardTitle>
                    <CardDescription>
                      Chúng tôi sẽ phản hồi trong vòng 24 giờ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tên của bạn</label>
                        <Input placeholder="Nguyễn Văn A" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" placeholder="email@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Chủ đề</label>
                        <Input placeholder="Vấn đề cần hỗ trợ" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nội dung</label>
                        <Textarea 
                          placeholder="Mô tả chi tiết vấn đề của bạn..."
                          rows={5}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Gửi yêu cầu
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin liên hệ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">support@tracuuluat.vn</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Hotline</p>
                          <p className="text-sm text-muted-foreground">19005001</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Live Chat</p>
                          <p className="text-sm text-muted-foreground">Thứ 2 - Thứ 6: 8h - 17h</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Giờ làm việc</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Thứ 2 - Thứ 6</span>
                        <span className="font-medium">8:00 - 17:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Thứ 7</span>
                        <span className="font-medium">8:00 - 12:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chủ nhật</span>
                        <span className="font-medium">Nghỉ</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Tài liệu tham khảo</CardTitle>
                  <CardDescription>
                    Tài liệu và hướng dẫn chi tiết
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-semibold text-blue-700">📘 Hướng dẫn sử dụng</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tài liệu đầy đủ về cách sử dụng hệ thống
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-2">
                        Xem tài liệu →
                      </Button>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <h4 className="font-semibold text-green-700">🎥 Video hướng dẫn</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Các video tutorial chi tiết từng tính năng
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-2">
                        Xem video →
                      </Button>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                      <h4 className="font-semibold text-purple-700">📚 API Documentation</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tài liệu API cho developers
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-2">
                        Xem API docs →
                      </Button>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4 py-2">
                      <h4 className="font-semibold text-orange-700">🔧 Troubleshooting</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Giải quyết các vấn đề thường gặp
                      </p>
                      <Button variant="link" className="p-0 h-auto mt-2">
                        Xem hướng dẫn →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
