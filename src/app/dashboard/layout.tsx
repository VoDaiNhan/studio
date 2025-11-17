'use client';

import * as React from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AppHeader } from '@/components/app-header';
import { AdminAccessDenied } from '@/components/admin-access-denied';
import { isAdmin } from '@/middleware/admin-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!loading && !user && mounted) {
      router.push('/login');
    }
  }, [user, loading, router, mounted]);

  if (loading || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin(user)) {
    return <AdminAccessDenied />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
