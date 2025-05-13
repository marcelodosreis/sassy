import { headers } from "next/headers";

import ManageBilling from "@/components/v1/ManageBilling";
import PricingSection from "@/components/v1/Pricing";
import { createClient } from "@/libs/supabase/server";
import AuthService from "@/services/auth";
import { capitalize } from "@/utils/capitalize";
import { loadTranslationsSSR } from "@/utils/loadTranslationsSSR";

export default async function Subscription() {
  const { translate } = await loadTranslationsSSR();
  const sharedData = JSON.parse((await headers()).get("x-shared-data") || "{}");
  const supabase = await createClient();
  const authService = new AuthService(supabase);
  const session = await authService.getSession();

  const currentPlanText = translate("pages.subscription.plan.description");
  const currentPlan = capitalize(sharedData?.plan);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {translate("pages.subscription.plan.title")}
                </h2>
                <p className="text-lg text-gray-600">
                  {currentPlanText.replace("{plan}", currentPlan)}
                </p>
              </div>
            </div>
            {sharedData?.plan !== "free" && session?.access_token && (
              <ManageBilling accessToken={session?.access_token} />
            )}
          </div>
        </div>
        <div className="mt-12">
          <PricingSection selectedOption={sharedData?.plan} />
        </div>
      </div>
    </div>
  );
}
