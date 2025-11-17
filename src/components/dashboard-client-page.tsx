'use client';

import { useState } from 'react';
import { ChatbotConfiguration } from '@/components/chatbot-configuration';
import { ChatPreview } from '@/components/chat-preview';
import type { AppearanceConfig } from '@/app/actions/appearance';

type DashboardClientPageProps = {
    initialConfig: AppearanceConfig;
};

export function DashboardClientPage({ initialConfig }: DashboardClientPageProps) {
  const [config, setConfig] = useState(initialConfig);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Cấu hình Chatbot
          </h1>
          <p className="text-muted-foreground text-lg">
            Tùy chỉnh giao diện, hành vi và kiến thức cho chatbot của bạn.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <ChatbotConfiguration config={config} setConfig={setConfig} />
          </div>
          <div className="sticky top-6">
            <ChatPreview config={config} />
          </div>
        </div>
      </div>
    </div>
  );
}
