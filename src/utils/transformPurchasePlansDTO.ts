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

export function transformPurchasePlansDTO(data: InputData[], translate: (key: string) => string): Plan[] {
    const planDetails: Record<string, Omit<Plan, 'priceMonthly' | 'priceAnnual' | 'idMonthly' | 'idAnnual'>> = {
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
            name: "Creator",
            description: "Great for creators looking to expand their reach.",
            features: [
                "✔ Access to core features",
                "✔ 3 projects",
                "✔ Email support"
            ],
            extraFeatures: "Everything in Starter, plus"
        },
        "Pro": {
            id: "pro",
            name: "Pro",
            description: "Perfect for teams scaling their Micro-SaaS business.",
            features: [
                "✔ Access to core features",
                "✔ Unlimited projects",
                "✔ Priority support"
            ],
            extraFeatures: "Everything in Creator, plus"
        }
    };

    const plansMap: Record<string, Plan> = {};

    if (Array.isArray(data)) {
        data.forEach(item => {
            const planName = item.productName.split(" - ")[1];
            if (!planName || !planDetails[planName]) {
                console.warn(`Invalid plan name: ${item.productName}`);
                return;
            }

            if (!plansMap[planName]) {
                plansMap[planName] = {
                    id: planDetails[planName].id,
                    name: planDetails[planName].name,
                    priceMonthly: "",
                    priceAnnual: "",
                    idMonthly: "",
                    idAnnual: "",
                    description: planDetails[planName].description,
                    features: planDetails[planName].features,
                    extraFeatures: planDetails[planName].extraFeatures
                };
            }

            if (plansMap[planName]) {
                if (item.interval === "month") {
                    plansMap[planName].priceMonthly = `$${item.amount}/month`;
                    plansMap[planName].idMonthly = item.id;
                } else if (item.interval === "year") {
                    plansMap[planName].priceAnnual = `$${item.amount}/year`;
                    plansMap[planName].idAnnual = item.id;
                }
            }
        });
    }

    return ["Starter", "Creator", "Pro"].map(planName => plansMap[planName]);
}
