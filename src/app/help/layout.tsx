import { ChatLayout } from '@/components/chat-layout';

export default function HelpPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayout>{children}</ChatLayout>;
}
