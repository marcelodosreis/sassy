import { GetMeBridge } from "@/bridges/getMe";
import { Plan } from "@/components/v1/Pricing/PlanCard";
import { FIXED_CURRENCY } from "@/constants/fixed-currency";
import { HAS_FREE_TRIAL } from "@/constants/has-free-trial";
import { useToast } from "@/contexts/ToastContext";
import PaymentService from "@/services/payment";

export const useCheckout = () => {
  const { addToast } = useToast();

  const handleCheckout = async ({
    plan,
    isAnnual,
    setIsLoading,
  }: {
    plan: Plan;
    isAnnual: boolean;
    setIsLoading: (isLoading: boolean) => void;
  }) => {
    if (plan.id === "free") {
      return;
    }

    setIsLoading(true);

    try {
      const getMeBridge = new GetMeBridge();
      const auth = await getMeBridge.execute();

      if (!auth?.id) {
        window.location.href = "/signin";
        return;
      }

      const priceId = isAnnual ? plan.idAnnual : plan.idMonthly;
      const response = await fetch("/api/v1/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          plan: plan.id,
          userId: auth.id,
          hasFreeTrial: HAS_FREE_TRIAL,
          currency: FIXED_CURRENCY,
        }),
      });

      const jsonResponse = await response.json();
      const sessionId = jsonResponse.id;

      if (!sessionId) {
        throw new Error("Error during payment checkout");
      }

      await PaymentService.redirectToCheckout(sessionId);
    } catch (error) {
      console.error("Error during payment checkout:", error);
      addToast({
        id: Date.now().toString(),
        message: "Error during Checkout",
        description:
          "An error occurred while processing your request. Please try again later.",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  return { handleCheckout };
};
