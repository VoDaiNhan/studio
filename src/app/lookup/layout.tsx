import { ChatLayout } from '@/components/chat-layout';

export default function LookupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayout>{children}</ChatLayout>;
}
