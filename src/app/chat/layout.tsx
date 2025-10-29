import { ChatHeader } from "./components/chat-header";
import { ChatSidebar } from "./components/chat-sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
