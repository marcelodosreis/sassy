'use client';

import { useState } from "react";

import ButtonComponent from "@/components/Button";
import { useI18n } from "@/hooks/useI18n";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/libs/supabase/client";
import SupabaseService from "@/services/supabase";

type SettingsOptionsProps = {
    userEmail?: string;
    currentPlan: string;
}

function SettingsOptions({ userEmail, currentPlan }: SettingsOptionsProps) {
    const { translate } = useI18n();
    const SupabaseServiceInstance = new SupabaseService(supabase);
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState({
        forgotPassword: false,
    });

    const handleForgotPassword = async (userEmail: string) => {
        setIsLoading((data) => ({ ...data, forgotPassword: true }));
        const response = await SupabaseServiceInstance.forgotPassword(userEmail);

        if (response) {
            await addToast({
                id: Date.now().toString(),
                message: translate('component-settings-options-password-change-request-sent'),
                description: translate('component-settings-options-password-change-description'),
                type: 'info',
            });
        } else {
            await addToast({
                id: Date.now().toString(),
                message: translate('component-settings-options-password-change-failed'),
                description: translate('component-settings-options-password-change-error'),
                type: 'error',
            });
        }
        setIsLoading((data) => ({ ...data, forgotPassword: false }));
    };

    return (
        <div className="space-y-6">
            {userEmail && <div className="flex justify-between items-start">
                <div className="max-w-md">
                    <h2 className="text-lg font-medium text-gray-700">{translate('component-settings-options-change-password')}</h2>
                </div>
                <a>
                    <ButtonComponent isLoading={isLoading.forgotPassword} onClick={() => handleForgotPassword(userEmail)} type="button" variant="outlined">{translate('component-settings-options-change-password')}</ButtonComponent>
                </a>
            </div>
            }
            <div className="flex justify-between items-start">
                <div className="max-w-md">
                    <h2 className="text-lg font-medium text-gray-700">{translate('component-settings-options-current-plan')}</h2>
                    <p className="text-gray-700">{currentPlan}</p>
                </div>
                <a href="/dashboard/subscription">
                    <ButtonComponent type="button" variant="filled">{translate('component-settings-options-manage-subscription')}</ButtonComponent>
                </a>
            </div>
        </div>
    );
}

export default SettingsOptions;
