import { headers } from 'next/headers';

import { Dashboard as DashboardContainer } from "@/components/v1/Dashboard";
import { ModalProvider } from "@/contexts/ModalContext";


export default async function Dashboard() {
  const sharedData = JSON.parse((await headers()).get('x-shared-data') || '{}');

  return (
    <ModalProvider>
      <div className="bg-white border-b border-gray-200">
        <DashboardContainer plan={sharedData?.plan} />
      </div>
    </ModalProvider>
  );
}


