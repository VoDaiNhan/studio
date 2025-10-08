import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { ChatbotConfiguration } from '@/components/chatbot-configuration';
import { ChatPreview } from '@/components/chat-preview';
import { getAppearanceConfig } from '@/app/actions/appearance';

export default async function Home() {
  const config = await getAppearanceConfig();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChatbotConfiguration initialConfig={config} />
              </div>
              <div>
                <ChatPreview config={config} />
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
