import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { BotMessageSquare, Cog, Database, LifeBuoy, Scale, UserCircle, History } from 'lucide-react';
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
            <SidebarMenuButton href="#" isActive>
              <Cog className="w-5 h-5" />
              Cấu hình
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <Database className="w-5 h-5" />
              Nguồn kiến thức
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <History className="w-5 h-5" />
              Lịch sử
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <BotMessageSquare className="w-5 h-5" />
              Sân chơi
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <LifeBuoy className="w-5 h-5" />
              Hướng dẫn
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <UserCircle className="w-5 h-5" />
              Tài khoản
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
