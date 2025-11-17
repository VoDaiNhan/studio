'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User, LogOut, Settings, UserCircle, Bell, HelpCircle, Shield, CreditCard, MessageSquare } from 'lucide-react';
import { SidebarTrigger } from './ui/sidebar';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { CustomLogo } from './custom-logo';

export function AppHeader() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <button 
          onClick={() => router.push('/chat')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <CustomLogo className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-auto px-4 justify-start gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.photoURL || undefined} alt="User avatar" />
              <AvatarFallback>
                {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="font-medium text-sm">{user?.displayName || 'Người dùng'}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback className="text-lg">
                  {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName || 'Người dùng'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'No email'}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Trang quản trị
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push('/dashboard')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/analytics')}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Phân tích</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Tài khoản
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <UserCircle className="mr-2 h-4 w-4" />
            <span>Hồ sơ cá nhân</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings?tab=notifications')}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Thông báo</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Hỗ trợ
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push('/help')}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Trợ giúp</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/settings?tab=security')}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Bảo mật</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
