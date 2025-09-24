import { ChatInterface } from '@/components/chat-interface';

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-body flex flex-col">
      <div className="flex-grow">
        <ChatInterface />
      </div>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        Powered by AI. Information may not be 100% accurate. Always consult official sources.
      </footer>
    </main>
  );
}
