import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { ChatbotConfiguration } from '@/components/chatbot-configuration';
import { ChatPreview } from '@/components/chat-preview';

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChatbotConfiguration />
              </div>
              <div>
                <ChatPreview />
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
