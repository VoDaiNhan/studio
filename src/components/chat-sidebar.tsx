'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, BookOpen, Search, Files, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CustomLogo } from './custom-logo';

export function ChatSidebar() {
  const router = useRouter();

  return (
    <div className="w-64 border-r bg-white flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-4">
        <Button 
          onClick={() => window.location.reload()}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          Cuộc trò chuyện mới
        </Button>
      </div>

      {/* Menu Items */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => router.push('/chat')}
          >
            <BookOpen className="h-4 w-4" />
            Văn bản Pháp Luật
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => router.push('/lookup')}
          >
            <Search className="h-4 w-4" />
            Tra cứu Văn bản
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => router.push('/templates')}
          >
            <Files className="h-4 w-4" />
            Mẫu đơn pháp lý
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => router.push('/help')}
          >
            <HelpCircle className="h-4 w-4" />
            Hỗ trợ
          </Button>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t text-xs text-gray-500 text-center">
        <p>Viện Công nghệ Blockchain</p>
        <p>và Trí tuệ Nhân tạo ABAII</p>
      </div>
    </div>
  );
}
