import { getAppearanceConfig } from '@/app/actions/appearance';
import { DashboardClientPage } from '@/components/dashboard-client-page';

export default async function Dashboard() {
  const initialConfig = await getAppearanceConfig();
  // DashboardClientPage has been renamed to DashboardPage
  // and the contents moved here.
  // We need to find a way to make this component async
  // and then we can render the DashboardPage component.
  // For now we will just render the DashboardClientPage
  return <DashboardClientPage initialConfig={initialConfig} />;
}
