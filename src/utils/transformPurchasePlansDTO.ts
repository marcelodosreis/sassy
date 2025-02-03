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

export function transformPurchasePlansDTO(data: InputData[], translate: (key: string) => string, currency?: string): Plan[] {
    const planDetails: Record<string, PlanDetails> = {
        "Starter": {
            id: "starter",
            name: translate('component-pricing-plan-starter-title'),
            description: translate('component-pricing-plan-starter-description'),
            features: [
                translate('component-pricing-plan-starter-feature-first'),
                translate('component-pricing-plan-starter-feature-second'),
                translate('component-pricing-plan-starter-feature-third'),
            ],
            extraFeatures: translate('component-pricing-plan-starter-extra')
        },
        "Creator": {
            id: "creator",
            name: translate('component-pricing-plan-creator-title'),
            description: translate('component-pricing-plan-creator-description'),
            features: [
                translate('component-pricing-plan-creator-feature-first'),
                translate('component-pricing-plan-creator-feature-second'),
                translate('component-pricing-plan-creator-feature-third'),
            ],
            extraFeatures: translate('component-pricing-plan-creator-extra')
        },
        "Pro": {
            id: "pro",
            name: translate('component-pricing-plan-pro-title'),
            description: translate('component-pricing-plan-pro-description'),
            features: [
                translate('component-pricing-plan-pro-feature-first'),
                translate('component-pricing-plan-pro-feature-second'),
                translate('component-pricing-plan-pro-feature-third'),
            ],
            extraFeatures: translate('component-pricing-plan-pro-extra')
        }
    };

    const plansMap: Record<string, Plan> = {};

    const setPlanPrice = (planName: string, interval: 'month' | 'year', amount: string, id: string, currency: string = 'usd'): void => {
        const newUnitAmount = currency !== 'usd' ? Number(amount) * 6 : amount;


        if (interval === 'month') {
            plansMap[planName].priceMonthly = formatPrice('component-pricing-subscription-plans-free-price-monthly', String(newUnitAmount));
            plansMap[planName].idMonthly = id;
        } else if (interval === 'year') {
            plansMap[planName].priceAnnual = formatPrice('component-pricing-subscription-plans-free-price-annual', String(newUnitAmount));
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
