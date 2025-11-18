'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';

export default function Home() {
  const router = useRouter();
  const { user, isUserLoading, role } = useUser();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        // Nếu đã đăng nhập, redirect theo role
        if (role === 'admin') {
          router.replace('/dashboard');
        } else {
          router.replace('/chat');
        }
      } else {
        // Nếu chưa đăng nhập, redirect đến trang login
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, role, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin" />
    </div>
  );
}
