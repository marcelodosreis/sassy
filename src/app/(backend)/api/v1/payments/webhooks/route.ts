import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { FINISH_CHECKOUT_EMAIL } from "@/constants/finish-checkout-email";
import { stripe } from "@/libs/stripe";
import { supabaseServerClient as supabase } from "@/libs/supabase/server";
import AuthService from "@/services/auth";
import EmailService from "@/services/email";
import PaymentService from "@/services/payment";
import SubscriptionService from "@/services/subscription";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: NextRequest): Promise<string> {
  const text = await req.text();
  return text;
}

export async function POST(req: NextRequest) {
  const emailService = new EmailService();
  const authService = new AuthService(supabase);
  const subscriptionService = new SubscriptionService(supabase);
  const paymentService = new PaymentService(stripe);

  const headersList = headers();
  const sig = (await headersList).get("stripe-signature");
  const rawBody = await getRawBody(req);

  if (!sig || !endpointSecret) {
    return NextResponse.json(
      { error: "Webhook Error: Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = paymentService.constructWebhookEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Erro desconhecido";
    console.error("Erro ao verificar a assinatura do webhook:", errorMessage);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = event.data.object as any;
        const { userId, plan } = session.metadata;

        await subscriptionService.upsertSubscription({
          user_id: userId,
          stripe_subscription_id: session.subscription,
          plan,
          status: "active",
          current_period_start: new Date(session.current_period_start * 1000),
          current_period_end: new Date(session.current_period_end * 1000),
        });

        const email = (await authService.getUserById(userId))?.email;
        if (!email) {
          throw new Error("Missing User Data in Completed Checkout");
        }

        await emailService.sendEmail({
          from: "Sassy - Powerful Micro-SaaS",
          to: [email],
          subject: "Welcome to Sassy!",
          text: "Welcome to Sassy! Your subscription has been activated.",
          html: FINISH_CHECKOUT_EMAIL.replace("{plan}", plan),
        });

        break;
      }

      case "customer.subscription.updated": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;

        await subscriptionService.updateSubscriptionPeriod(
          subscription.id,
          new Date(subscription.current_period_start * 1000),
          new Date(subscription.current_period_end * 1000)
        );

        await subscriptionService.updateSubscriptionStatus(
          subscription.id,
          subscription.status
        );
        break;
      }

      case "customer.subscription.deleted": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;
        await subscriptionService.cancelSubscription(subscription.id);
        break;
      }

      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
