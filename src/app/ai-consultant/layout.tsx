import { ChatLayout } from '@/components/chat-layout';

export default function AIConsultantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayout>{children}</ChatLayout>;
}
