'use client';
import { getAppearanceConfig } from '@/app/actions/appearance';
import { DashboardClientPage } from '@/components/dashboard-client-page';
import { useEffect, useState } from 'react';
import type { AppearanceConfig } from '@/app/actions/appearance';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [initialConfig, setInitialConfig] = useState<AppearanceConfig | null>(null);
  const [loading, setLoading] = useState(true);

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
    loadConfig();
  }, []);

  if (loading || !initialConfig) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return <DashboardClientPage initialConfig={initialConfig} />;
}
