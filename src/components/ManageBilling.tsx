'use client';

import { useRouter } from "next/navigation";

import { useState } from "react";

import ButtonComponent from "./Button";

export async function handleManageBilling(redirect: (url: string) => void, accessToken: string): Promise<void> {
    try {
        const response = await fetch('/api/payments/create-billing-portal', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to create billing portal session');
        }

        const { url } = await response.json();
        redirect(url);
    } catch (error) {
        console.error('Error redirecting to billing portal:', error);
        throw new Error('Não foi possível redirecionar para o portal de cobrança.');
    }
}

type Props = {
    accessToken: string
}
export default function ManageBilling({ accessToken }: Props) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800">Subscription Details</h2>
            </div>
            <ButtonComponent
                onClick={
                    async () => {
                        setIsLoading(true)
                        await handleManageBilling(router.push, accessToken)
                    }
                }
                type="button"
                variant="outlined"
                isLoading={isLoading}
                size="small"
                className="text-indigo-600 hover:underline border border-indigo-600 rounded px-4 py-2 md:w-1/6 w-2/4">Manage billing info</ButtonComponent>
        </div>
    );
}