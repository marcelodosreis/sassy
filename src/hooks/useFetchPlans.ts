import { useState, useEffect } from 'react';

import { Plan } from '@/components/Pricing/PlanCard';
import { FIXED_CURRENCY } from '@/constants/FIXED_CURRENCY';
import { HAS_FREE_TRIAL } from '@/constants/HAS_FREE_TRIAL';

import { useI18n } from './useI18n';


export const useFetchPlans = (hasFreeplan: boolean, setIsLoading: (isLoading: boolean) => void) => {
    const { translate } = useI18n();
    const SUBSCRIPTION_PLANS_BASE: Plan[] = [
        {
            id: 'free',
            name: translate('components.pricing.plans.free.title'),
            description: translate('components.pricing.plans.free.description'),
            priceMonthly: translate('components.pricing.plans.prices.monthly').replace("{value}", "0"),
            priceAnnual: translate('components.pricing.plans.prices.annual').replace("{value}", "0"),
            features: [
                translate('components.pricing.plans.free.features.first'),
                translate('components.pricing.plans.free.features.second'),
                translate('components.pricing.plans.free.features.third'),
            ],
            extraFeatures: translate('components.pricing.plans.free.extra'),
        },
    ];

    const [plans, setPlans] = useState<Plan[]>(hasFreeplan && !HAS_FREE_TRIAL ? SUBSCRIPTION_PLANS_BASE : []);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch(`/api/payments/get-plans?currency=${FIXED_CURRENCY}`);
                const data: Plan[] = await response.json();
                setPlans((prev: Plan[]) => {
                    if (!prev) return data;
                    return prev.length >= 4 ? [...prev] : [...prev, ...data];
                });
            } catch (error) {
                console.error('Erro ao buscar planos:', error);
            }
            setIsLoading(false);
        };
        fetchPlans();
    }, []);

    return { plans, setIsLoading };
};
