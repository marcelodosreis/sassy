import { calculateCurrencyAmount } from "./calculateCurrencyAmount";

export interface InputData {
    id: string;
    productName: string;
    description: string | null;
    interval: 'month' | 'year';
    amount: string;
    currency: string;
}

interface Plan {
    id: 'starter' | 'creator' | 'pro';
    name: string;
    priceMonthly: string;
    priceAnnual: string;
    idMonthly: string;
    idAnnual: string;
    description: string;
    features: string[];
    extraFeatures: string;
}

type PlanDetails = Omit<Plan, 'priceMonthly' | 'priceAnnual' | 'idMonthly' | 'idAnnual'>;

export function transformPurchasePlansDTO(data: InputData[], translate: (key: string) => string, currency: string): Plan[] {
    const planDetails: Record<string, PlanDetails> = {
        "Starter": {
            id: "starter",
            name: translate('components.pricing.plans.starter.title'),
            description: translate('components.pricing.plans.starter.description'),
            features: [
                translate('components.pricing.plans.starter.features.first'),
                translate('components.pricing.plans.starter.features.second'),
                translate('components.pricing.plans.starter.features.third'),
            ],
            extraFeatures: translate('components.pricing.plans.starter.extra')
        },
        "Creator": {
            id: "creator",
            name: translate('components.pricing.plans.creator.title'),
            description: translate('components.pricing.plans.creator.description'),
            features: [
                translate('components.pricing.plans.creator.features.first'),
                translate('components.pricing.plans.creator.features.second'),
                translate('components.pricing.plans.creator.features.third'),
            ],
            extraFeatures: translate('components.pricing.plans.creator.extra')
        },
        "Pro": {
            id: "pro",
            name: translate('components.pricing.plans.pro.title'),
            description: translate('components.pricing.plans.pro.description'),
            features: [
                translate('components.pricing.plans.pro.features.first'),
                translate('components.pricing.plans.pro.features.second'),
                translate('components.pricing.plans.pro.features.third'),
            ],
            extraFeatures: translate('components.pricing.plans.pro.extra')
        }
    };

    const plansMap: Record<string, Plan> = {};

    const setPlanPrice = (planName: string, interval: 'month' | 'year', amount: string, id: string, currency: string): void => {
        const newUnitAmount = calculateCurrencyAmount(amount, currency);


        if (interval === 'month') {
            plansMap[planName].priceMonthly = formatPrice('components.pricing.plans.prices.monthly', String(newUnitAmount));
            plansMap[planName].idMonthly = id;
        } else if (interval === 'year') {
            plansMap[planName].priceAnnual = formatPrice('components.pricing.plans.prices.annual', String(newUnitAmount));
            plansMap[planName].idAnnual = id;
        }
    };

    const formatPrice = (key: string, amount: string): string => {
        return `${translate(key).replace("{value}", amount)}`;
    };

    if (Array.isArray(data)) {
        data.forEach(item => {
            const planName = item.productName.split(" - ")[1];
            if (!planName || !planDetails[planName]) {
                console.warn(`Invalid plan name: ${item.productName}`);
                return;
            }

            if (!plansMap[planName]) {
                plansMap[planName] = {
                    ...planDetails[planName],
                    priceMonthly: "",
                    priceAnnual: "",
                    idMonthly: "",
                    idAnnual: ""
                };
            }

            setPlanPrice(planName, item.interval, item.amount, item.id, currency);
        });
    }

    return ["Starter", "Creator", "Pro"].map(planName => plansMap[planName]);
}
