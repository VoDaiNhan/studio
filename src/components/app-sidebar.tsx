import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { BotMessageSquare, Cog, Database, LifeBuoy, Scale, UserCircle, History, LayoutDashboard, BarChart3, Star } from 'lucide-react';
import { Button } from './ui/button';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Scale className="h-6 w-6 text-primary" />
          </Button>
          <h2 className="text-xl font-semibold tracking-tight">Trợ lý Luật</h2>
        </div>
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
            <SidebarMenuButton href="#">
              <History className="w-5 h-5" />
              Lịch sử & Phản hồi
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <BarChart3 className="w-5 h-5" />
              Phân tích & Thống kê
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <UserCircle className="w-5 h-5" />
              Tài khoản & Cài đặt
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
