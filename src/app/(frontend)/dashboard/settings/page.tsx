import { headers } from "next/headers";

import SettingsOptions from "@/components/v1/SettingsOptions";
import { createClient } from "@/libs/supabase/server";
import AuthService from "@/services/auth";
import { capitalize } from "@/utils/capitalize";
import { loadTranslationsSSR } from '@/utils/loadTranslationsSSR';

export default async function Settings() {
    const { translate } = await loadTranslationsSSR();
    const supabase = await createClient();
    const AuthServiceInstance = new AuthService(supabase);
    const data = await AuthServiceInstance.getUser();
    const sharedData = JSON.parse((await headers()).get('x-shared-data') || '{}');

    return (
        <>
            <main className="flex-1 flex justify-center p-6 bg-white pt-18">
                <div className="w-full max-w-3xl space-y-6">
                    <div className="space-y-4">
                        {data?.user_metadata?.name && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{translate("pages.settings.name")}</label>
                                <input
                                    type="text"
                                    value={data?.user_metadata?.name}
                                    readOnly
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs bg-gray-100 text-gray-700 focus:outline-hidden sm:text-sm"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">{translate("pages.settings.email")}</label>
                            <input
                                type="email"
                                value={data?.email}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs bg-gray-100 text-gray-700 focus:outline-hidden sm:text-sm"
                            />
                        </div>
                    </div>

                    <SettingsOptions currentPlan={capitalize(sharedData.plan)} userEmail={data?.email} />
                </div>
            </main>
        </>
    );
}
