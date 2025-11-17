'use client';

import { ChatHeader } from './chat-header';
import { ReactNode } from 'react';

export function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <ChatHeader />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
