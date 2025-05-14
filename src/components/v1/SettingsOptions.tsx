'use client';

import { useState } from "react";

import ButtonComponent from "@/components/v1/Button";
import { useI18n } from "@/contexts/i18nContext";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/libs/supabase/client";
import AuthService from "@/services/auth";

type SettingsOptionsProps = {
    userEmail?: string;
    currentPlan: string;
}

function SettingsOptions({ userEmail, currentPlan }: SettingsOptionsProps) {
    const { translate } = useI18n("components.settings-options");
    const authService = new AuthService(supabase);
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState({
        forgotPassword: false,
    });

    const handleForgotPassword = async (userEmail: string) => {
        setIsLoading((data) => ({ ...data, forgotPassword: true }));
        const response = await authService.forgotPassword(userEmail);

        if (response) {
            await addToast({
                id: Date.now().toString(),
                message: translate('toast.success.title'),
                description: translate('toast.success.description'),
                type: 'info',
            });
        } else {
            await addToast({
                id: Date.now().toString(),
                message: translate('toast.error.title'),
                description: translate('toast.error.description'),
                type: 'error',
            });
        }
        setIsLoading((data) => ({ ...data, forgotPassword: false }));
    };

    return (
        <div className="space-y-6">
            {userEmail && <div className="flex justify-between items-start">
                <div className="max-w-md">
                    <h2 className="text-lg font-medium text-gray-700">{translate('actions.change-password')}</h2>
                </div>
                <a>
                    <ButtonComponent isLoading={isLoading.forgotPassword} onClick={() => handleForgotPassword(userEmail)} type="button" variant="outlined">{translate('actions.change-password')}</ButtonComponent>
                </a>
            </div>
            }
            <div className="flex justify-between items-start">
                <div className="max-w-md">
                    <h2 className="text-lg font-medium text-gray-700">{translate('plan')}</h2>
                    <p className="text-gray-700">{currentPlan}</p>
                </div>
                <a href="/dashboard/subscription">
                    <ButtonComponent type="button" variant="filled">{translate('subscription')}</ButtonComponent>
                </a>
            </div>
        </div>
    );
}

export default SettingsOptions;
