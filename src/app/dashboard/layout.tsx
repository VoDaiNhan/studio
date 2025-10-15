'use client';
import * as React from 'react';
import { useUser, useAuth } from '@/firebase';
import { useRouter, redirect } from 'next/navigation';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Loader2, LogOut, Settings } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // While checking for auth state, show a loader.
  // This also prevents a flash of the login page for authenticated users.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }
  
  // After loading, if there's still no user, we'll redirect.
  // Returning null here prevents children from rendering with a null user object.
  if (!user) {
    return redirect('/login');
  }

  // If we have a user, render the full dashboard.
  return (
      <div className="min-h-screen w-full">
        {children}
      </div>
  );
}
