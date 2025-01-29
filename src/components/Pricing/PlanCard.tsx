import { useI18n } from '@/hooks/useI18n';

import ButtonComponent from '../Button';

export type Plan = {
    id: 'free' | 'starter' | 'creator' | 'pro';
    name: string;
    priceMonthly: string;
    priceAnnual: string;
    idMonthly?: string;
    idAnnual?: string;
    description: string;
    features: string[];
    extraFeatures: string;
};

export default function PlanCard({ plan, isAnnual, isSelected, isMostPopular, handle }: {
    plan: Plan;
    isAnnual: boolean;
    isSelected: boolean;
    isMostPopular: boolean;
    handle: (plan: Plan) => Promise<void>;
}) {
    const { translate } = useI18n();

    const bgColor = isSelected
        ? 'bg-gray-50'
        : isMostPopular
            ? 'bg-indigo-50'
            : 'bg-white';

    const borderColor = isSelected
        ? 'border-gray-600'
        : isMostPopular
            ? 'border-indigo-600'
            : 'border-gray-200';

    return (
        <div
            key={plan.id}
            className={`${bgColor} ${borderColor} border rounded-lg shadow-md p-8 relative flex flex-col`}
        >
            {isSelected && (
                <span className="absolute top-0 right-0 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    {translate('component-pricing-selected-tag')}
                </span>
            )}
            {isMostPopular && !isSelected && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    {translate('component-pricing-popular-tag')}
                </span>
            )}
            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            <p className="mt-6 text-4xl font-extrabold text-gray-900">
                {isAnnual ? plan.priceAnnual : plan.priceMonthly}
            </p>
            <p className="mt-4 text-gray-600">{plan.description}</p>
            <ButtonComponent
                disabled={isSelected}
                type="button"
                className="mt-6"
                onClick={() => handle(plan)}
            >
                {isSelected
                    ? translate('component-pricing-button-subscribed')
                    : translate('component-pricing-button')
                }
            </ButtonComponent>
            <ul className="mt-6 space-y-4 text-gray-600 text-left">
                {plan.extraFeatures && (
                    <li className="text-center">
                        <strong>{plan.extraFeatures}</strong>
                    </li>
                )}
                {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
        </div>
    );
}
