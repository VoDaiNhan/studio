import { getAppearanceConfig } from '@/app/actions/appearance';
import { DashboardClientPage } from '@/components/dashboard-client-page';

export default async function Home() {
  const initialConfig = await getAppearanceConfig();
  return <DashboardClientPage initialConfig={initialConfig} />;
}
