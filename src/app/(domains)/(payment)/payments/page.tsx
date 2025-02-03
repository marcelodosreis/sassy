'use client';
import { useSearchParams } from 'next/navigation';

import BackLink from "@/components/BackLink";
import { useI18n } from '@/hooks/useI18n';

const PaymentStatus = () => {
    const { translate } = useI18n();
    const searchParams = useSearchParams();
    const status = searchParams && searchParams.get('status');

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                {status === 'success' ? (
                    <>
                        <BackLink href='/dashboard/subscription' label={translate("payment-status-back-to-billing")} />
                        <h2 className="text-2xl font-semibold text-center text-gray-900">{translate("payment-status-success-title")}</h2>
                        <p className="text-center text-sm text-gray-600">{translate("payment-status-success-message")}</p>
                    </>
                ) : status === 'cancel' ? (
                    <>
                        <BackLink href='/dashboard/subscription' label={translate("payment-status-back-to-settings")} />
                        <h2 className="text-2xl font-semibold text-center text-gray-900">{translate("payment-status-cancel-title")}</h2>
                        <p className="text-center text-sm text-gray-600">{translate("payment-status-cancel-message")}</p>
                    </>
                ) : (
                    <>
                        <BackLink href='./' label={translate("payment-status-back-to-home")} />
                        <h2 className="text-2xl font-semibold text-center text-gray-900">{translate("payment-status-unknown-title")}</h2>
                        <p className="text-center text-sm text-gray-600">{translate("payment-status-unknown-message")}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentStatus;
