import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

import { calculateCurrencyAmount } from '@/utils/calculateCurrencyAmount';

export default class StripeService {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  async createCheckoutSession(
    priceId: string, 
    plan: string, 
    userId: string, 
    origin: string, 
    freeTrial?: number, 
    currency?: string, 
  ): Promise<Stripe.Checkout.Session> {

    const price = await this.stripe.prices.retrieve(priceId);
    const recurringInterval = price.recurring?.interval;

    if (!recurringInterval) {
      throw new Error('Recurring interval not found for this price');
    }

    const sessionData: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${origin}/payments?status=success`,
      cancel_url: `${origin}/payments?status=cancel`,
      metadata: { userId, plan },
    };
  
    if (currency) {
      const unitAmount = price.unit_amount;
      const newUnitAmount = calculateCurrencyAmount(String(unitAmount), currency);
      
      sessionData.line_items = [{
        price_data: {
          currency: currency,
          product_data: {
            name: plan,
          },
          recurring: {
            interval: recurringInterval,
          },
          unit_amount: newUnitAmount,
        },
        quantity: 1,
      }];
    }
  
    if (freeTrial) {
      sessionData.subscription_data = {
        trial_period_days: freeTrial,
      };
    }
  
    const session = await this.stripe.checkout.sessions.create(sessionData);
    return session;
  }
  

  async listActivePrices(): Promise<Stripe.Price[]> {
    const prices = await this.stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });
    return prices.data;
  }

  constructWebhookEvent(rawBody: string | Buffer, sig: string | string[], endpointSecret: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  }

  async getCustomerIdFromSubscription(subscriptionId: string): Promise<string | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription.customer as string;
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
      return null;
    }
  };
  
  async createBillingPortalSession(customerId: string) {
    const portal = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/dashboard/subscription`,
    });

    return portal;
  }
  static redirectToCheckout(sessionId: string): void {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!).then((clientStripe) => {
      if (clientStripe) {
        clientStripe.redirectToCheckout({ sessionId });
      }
    });
  }
}
