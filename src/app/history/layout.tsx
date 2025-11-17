import { ChatLayout } from '@/components/chat-layout';

export default function HistoryPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayout>{children}</ChatLayout>;
}
