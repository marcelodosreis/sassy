import { Plan } from "@/components/Pricing/PlanCard";
import { FIXED_CURRENCY } from "@/constants/FIXED_CURRENCY";
import { HAS_FREE_TRIAL } from "@/constants/HAS_FREE_TRIAL";
import { useToast } from "@/hooks/useToast";
import { supabase } from '@/libs/supabase/client';
import StripeService from '@/services/stripe';
import SupabaseService from '@/services/supabase';

export const useCheckout = () => {
    const { addToast } = useToast();

    const handleCheckout = async ({ plan, isAnnual, setIsLoading }: { plan: Plan, isAnnual: boolean, setIsLoading: (isLoading: boolean) => void }) => {
        if (plan.id === 'free') {
            return;
        }

        setIsLoading(true);
        const SupabaseServiceInstance = new SupabaseService(supabase);
        const user = await SupabaseServiceInstance.getUserId();

        if (!user) {
            window.location.href = '/signin';
            return;
        }

        try {
            const priceId = isAnnual ? plan.idAnnual : plan.idMonthly;
            const response = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, plan: plan.id, userId: user, hasFreeTrial: HAS_FREE_TRIAL, currency: FIXED_CURRENCY }),
            });

            const jsonResponse = await response.json();
            const sessionId = jsonResponse.id;

            if (sessionId) {
                await StripeService.redirectToCheckout(sessionId);
            } else {
                addToast({
                    id: Date.now().toString(),
                    message: 'Error during Checkout',
                    description: 'An error occurred while processing your request. Please try again later.',
                    type: 'error',
                });
            }
        } catch (error) {
            console.error('Error during payment checkout:', error);
            addToast({
                id: Date.now().toString(),
                message: 'Error during Checkout',
                description: 'An error occurred while processing your request. Please try again later.',
                type: 'error',
            });
            setIsLoading(false);
        }
    };

    return { handleCheckout };
};
