import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Bot, Book, Briefcase, GraduationCap, Send, User, FileText, MessageCircle } from 'lucide-react';

const quickReplies = [
  { icon: Book, text: 'Đăng ký học phần' },
  { icon: GraduationCap, text: 'Chương trình đào tạo & Tốt nghiệp?' },
  { icon: FileText, text: 'Cải thiện kết quả học tập' },
  { icon: MessageCircle, text: 'Quy chế & Thủ tục sinh viên' },
  { icon: Briefcase, text: 'Định hướng nghề nghiệp' },
  { icon: User, text: 'Liên hệ Cố vấn học tập' },
];

export function ChatPreview() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary-foreground text-primary">
              <Bot />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-lg">Khoa CNTT</p>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-xs">Online</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 flex flex-col gap-4 bg-muted/20">
        <Card className="p-4 bg-background">
          <p className="font-medium mb-3">Chào Em! Em cần hỗ trợ gì?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {quickReplies.map((reply, index) => (
              <Button key={index} variant="outline" className="justify-start h-auto py-2">
                <reply.icon className="w-4 h-4 mr-2 shrink-0" />
                <span className="whitespace-normal text-left">{index + 1}. {reply.text}</span>
              </Button>
            ))}
          </div>
        </Card>
      </CardContent>
      <div className="p-4 border-t">
        <div className="relative">
          <Input placeholder="Type your message..." className="pr-12" />
          <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
