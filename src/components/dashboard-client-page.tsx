'use client';

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { ChatbotConfiguration } from '@/components/chatbot-configuration';
import { ChatPreview } from '@/components/chat-preview';
import type { AppearanceConfig } from '@/app/actions/appearance';

type DashboardClientPageProps = {
    initialConfig: AppearanceConfig;
};

export function DashboardClientPage({ initialConfig }: DashboardClientPageProps) {
  const [config, setConfig] = useState(initialConfig);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <ChatbotConfiguration config={config} setConfig={setConfig} />
              </div>
              <div className="sticky top-6 h-[calc(100vh-88px)]">
                <ChatPreview config={config} />
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
