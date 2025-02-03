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
            name: translate('component-pricing-subscription-plans-free-name'),
            priceMonthly: translate('component-pricing-subscription-plans-free-price-monthly').replace("{value}", "0"),
            priceAnnual: translate('component-pricing-subscription-plans-free-price-annual').replace("{value}", "0"),
            description: translate('component-pricing-subscription-plans-free-description'),
            features: [
                translate('component-pricing-subscription-plans-free-feature-1'),
                translate('component-pricing-subscription-plans-free-feature-2'),
            ],
            extraFeatures: translate('component-pricing-subscription-plans-free-extra-features'),
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
