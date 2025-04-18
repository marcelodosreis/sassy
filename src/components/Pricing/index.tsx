'use client';

import { useState } from 'react';

import { HAS_FREE_TRIAL } from '@/constants/has-free-trial';
import { useCheckout } from '@/hooks/useCheckout';
import { useFetchPlans } from '@/hooks/useFetchPlans';
import { useI18n } from '@/hooks/useI18n';

import Spinner from '../Spinner';
import PlanCard from './PlanCard';
import Toggle from '../Toggle';

export type PricingProps = {
    selectedOption: 'preview' | 'free' | 'starter' | 'creator' | 'pro';
    hasFreeplan?: boolean;
};

export default function Pricing({ selectedOption, hasFreeplan = true }: PricingProps) {
    const { translate } = useI18n();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { plans } = useFetchPlans(hasFreeplan, setIsLoading);
    const [isAnnual, setIsAnnual] = useState<boolean>(false);
    const { handleCheckout } = useCheckout();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900">{translate('components.pricing.title')}</h2>
            <p className="mt-4 text-lg text-gray-600">{translate('components.pricing.description')}</p>

            {HAS_FREE_TRIAL && (
                <div className="mt-4 bg-indigo-100 p-4 rounded-md text-gray-800">
                    <p className="text-lg font-bold">{translate('components.pricing.trial.title')} {HAS_FREE_TRIAL}!</p>
                    <p>{translate('components.pricing.trial.description')}</p>
                </div>
            )}

            <Toggle
                labels={{
                    off: translate('components.pricing.toggle.monthly'),
                    on: translate('components.pricing.toggle.annual')
                }}
                initialState={false}
                onToggle={setIsAnnual}
            />

            {isLoading ? <Spinner /> : (
                <div className={`mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${plans.length} gap-8`}>
                    {plans.map((plan) => {
                        if (!plan?.id) return null;

                        const isSelected = selectedOption === plan?.id;
                        const isMostPopular = plan?.id === 'creator';

                        return (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isAnnual={isAnnual}
                                isSelected={isSelected}
                                isMostPopular={isMostPopular}
                                handle={() => handleCheckout({ plan, isAnnual, setIsLoading })}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
