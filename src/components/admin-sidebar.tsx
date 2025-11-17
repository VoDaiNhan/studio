'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Scale,
  LayoutDashboard,
  Settings,
  BookOpen,
  Search,
  History,
  BarChart3,
  User,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Tổng quan',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Cấu hình Chatbot',
    url: '/dashboard/config',
    icon: Settings,
  },
  {
    title: 'Quản lý Kiến thức',
    url: '/dashboard/knowledge',
    icon: BookOpen,
  },
  {
    title: 'Tra cứu Điều khoản',
    url: '/dashboard/lookup',
    icon: Search,
  },
  {
    title: 'Lịch sử Trò chuyện',
    url: '/dashboard/history',
    icon: History,
  },
  {
    title: 'Phân tích & Thống kê',
    url: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Tài khoản & Cài đặt',
    url: '/dashboard/settings',
    icon: User,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-4 border-b">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-base font-bold">Trợ lý Luật</h2>
                <p className="text-xs text-muted-foreground">Giao thông</p>
              </div>
            </div>
          </div>
          <SidebarGroupContent className="mt-2 px-2">
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url} className="flex items-center gap-3 px-3 py-2 rounded-md">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
