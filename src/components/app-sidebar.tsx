import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Bot, Cog, Contact, FileText, Gift, User, BarChart, MessageSquare, LayoutGrid, UserCircle } from 'lucide-react';
import { Button } from './ui/button';

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Bot className="h-6 w-6 text-primary" />
          </Button>
          <h2 className="text-xl font-semibold tracking-tight">OmniChat</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton href="#" isActive>
              <Cog className="w-5 h-5" />
              Configuration
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <BarChart className="w-5 h-5" />
              Leads
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <MessageSquare className="w-5 h-5" />
              Embed
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <LayoutGrid className="w-5 h-5" />
              Guide
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton href="#">
              <UserCircle className="w-5 h-5" />
              Profile
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
