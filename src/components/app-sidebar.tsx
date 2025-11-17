import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { BotMessageSquare, Cog, Database, LifeBuoy, Scale, UserCircle, History, LayoutDashboard, BarChart3, Star, Search } from 'lucide-react';
import { Button } from './ui/button';
import { CustomLogo } from './custom-logo';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <a href="/chat" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <CustomLogo className="h-6 w-6" />
          </Button>
          <h2 className="text-xl font-semibold tracking-tight">Trợ lý Luật</h2>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <LayoutDashboard className="w-5 h-5" />
              Tổng quan
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" isActive>
              <Cog className="w-5 h-5" />
              Cấu hình Chatbot
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <Database className="w-5 h-5" />
              Quản lý Kiến thức
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/lookup">
              <Search className="w-5 h-5" />
              Tra cứu Điều khoản
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/history">
              <History className="w-5 h-5" />
              Lịch sử Trò chuyện
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton href="/analytics">
              <BarChart3 className="w-5 h-5" />
              Phân tích & Thống kê
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="/settings">
              <UserCircle className="w-5 h-5" />
              Tài khoản & Cài đặt
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
