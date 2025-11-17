'use client';

import { getAppearanceConfig } from '@/app/actions/appearance';
import { DashboardClientPage } from '@/components/dashboard-client-page';
import { useEffect, useState } from 'react';
import type { AppearanceConfig } from '@/app/actions/appearance';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { AdminAccessDenied } from '@/components/admin-access-denied';
import { isAdmin } from '@/middleware/admin-auth';

export default function DashboardConfigPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [initialConfig, setInitialConfig] = useState<AppearanceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push('/login');
    }
  }, [user, authLoading, router, mounted]);

  useEffect(() => {
    async function loadConfig() {
      try {
        const config = await getAppearanceConfig();
        setInitialConfig(config);
      } catch (error) {
        console.error("Failed to load appearance config:", error);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      loadConfig();
    }
  }, [user]);

  if (authLoading || loading || !mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin(user)) {
    return <AdminAccessDenied />;
  }

  if (!initialConfig) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return <DashboardClientPage initialConfig={initialConfig} />;
}
