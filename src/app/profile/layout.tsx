import { ChatLayout } from '@/components/chat-layout';

export default function ProfilePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayout>{children}</ChatLayout>;
}
