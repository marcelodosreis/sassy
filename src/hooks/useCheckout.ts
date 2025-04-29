import { Plan } from "@/components/Pricing/PlanCard";
import { FIXED_CURRENCY } from "@/constants/fixed-currency";
import { HAS_FREE_TRIAL } from "@/constants/has-free-trial";
import { useToast } from "@/hooks/useToast";
import { supabase } from '@/libs/supabase/client';
import AuthService from '@/services/auth';
import PaymentService from '@/services/payment';

export const useCheckout = () => {
    const { addToast } = useToast();

    const handleCheckout = async ({ plan, isAnnual, setIsLoading }: { plan: Plan, isAnnual: boolean, setIsLoading: (isLoading: boolean) => void }) => {
        if (plan.id === 'free') {
            return;
        }

        setIsLoading(true);
        const AuthServiceInstance = new AuthService(supabase);
        const userId = await AuthServiceInstance.getUserId();

        if (!userId) {
            window.location.href = '/signin';
            return;
        }

        try {
            const priceId = isAnnual ? plan.idAnnual : plan.idMonthly;
            const response = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, plan: plan.id, userId: userId, hasFreeTrial: HAS_FREE_TRIAL, currency: FIXED_CURRENCY }),
            });

            const jsonResponse = await response.json();
            const sessionId = jsonResponse.id;

            if (sessionId) {
                await PaymentService.redirectToCheckout(sessionId);
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
