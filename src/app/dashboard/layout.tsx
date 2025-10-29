'use client';
import * as React from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading, role } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    // If loading is finished...
    if (!isUserLoading) {
      // ...and there's no user, or the user is not an admin, redirect to login.
      if (!user || role !== 'admin') {
        router.push('/login');
      }
    }
  }, [user, isUserLoading, role, router]);

  // While checking for auth state and role, or if user is not an admin, show a loader.
  if (isUserLoading || !user || role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  // If we have an admin user, render the full dashboard.
  return (
      <div className="min-h-screen w-full">
        {children}
      </div>
  );
}
