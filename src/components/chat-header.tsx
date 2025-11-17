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
import { LayoutDashboard, LogOut, Settings, UserCircle, Bell, HelpCircle, Shield, MessageSquare, Menu, History } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { CustomLogo } from './custom-logo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState, useEffect } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface RecentConversation {
  id: string;
  userQuery: string;
  timestamp: any;
}

export function ChatHeader() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [photoURL, setPhotoURL] = useState<string>('');
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);

  useEffect(() => {
    const loadAvatar = async () => {
      if (!user) return;
      
      try {
        const { getAvatarLocal } = await import('@/lib/local-storage-avatar');
        const avatar = await getAvatarLocal(user.uid);
        if (avatar) {
          setPhotoURL(avatar);
        }
      } catch (error) {
        console.error('Error loading avatar:', error);
      }
    };
    
    loadAvatar();
  }, [user]);

  useEffect(() => {
    const loadRecentConversations = async () => {
      if (!user) {
        setRecentConversations([]);
        return;
      }

      try {
        const { firestore } = initializeFirebase();
        const userConversationsCol = collection(firestore, 'users', user.uid, 'conversations');
        
        const q = query(
          userConversationsCol,
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        
        const snapshot = await getDocs(q);
        const conversations = snapshot.docs.map(doc => ({
          id: doc.id,
          userQuery: doc.data().userQuery,
          timestamp: doc.data().timestamp
        })) as RecentConversation[];
        
        setRecentConversations(conversations);
      } catch (error) {
        console.error('Error loading recent conversations:', error);
        setRecentConversations([]);
      }
    };

    loadRecentConversations();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Chat', href: '/chat' },
    { icon: MessageSquare, label: 'Phân tích', href: '/analytics' },
    { icon: UserCircle, label: 'Hồ sơ', href: '/profile' },
    { icon: Settings, label: 'Cài đặt', href: '/settings' },
    { icon: HelpCircle, label: 'Trợ giúp', href: '/help' },
  ];

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => router.push('/chat')}>
              <CustomLogo className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Trợ lý Luật</h2>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo in Header */}
        <button 
          onClick={() => router.push('/chat')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <CustomLogo className="w-6 h-6" />
          <h1 className="text-xl font-semibold">AI Tra cứu Luật</h1>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* History Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <History className="h-4 w-4" />
              Lịch sử trò chuyện
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Lịch sử trò chuyện</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => router.push('/history')}
                >
                  Xem tất cả
                </Button>
              </div>
              {recentConversations.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-4">
                  Chưa có lịch sử trò chuyện
                </div>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {recentConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => router.push('/history')}
                      className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                    >
                      <p className="text-sm line-clamp-2">{conv.userQuery}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {conv.timestamp?.toDate ? 
                          new Intl.DateTimeFormat('vi-VN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }).format(conv.timestamp.toDate()) 
                          : 'Vừa xong'}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-auto px-4 justify-start gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={photoURL || user?.photoURL || undefined} alt="User avatar" />
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
                <AvatarImage src={photoURL || user?.photoURL || undefined} />
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
      </div>
    </header>
  );
}
