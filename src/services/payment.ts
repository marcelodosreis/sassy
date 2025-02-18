import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

import { calculateCurrencyAmount } from '@/utils/calculateCurrencyAmount';

export default class PaymentService {
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
    currency?: string
  ): Promise<Stripe.Checkout.Session> {
    const price = await this.getPrice(priceId);
    const recurringInterval = price.recurring?.interval;

    if (!recurringInterval) {
      throw new Error('Recurring interval not found for this price');
    }

    const sessionData = this.buildCheckoutSessionData(
      priceId,
      plan,
      userId,
      origin,
      recurringInterval,
      freeTrial,
      currency,
      price.unit_amount
    );

    return await this.stripe.checkout.sessions.create(sessionData);
  }

  async listActivePrices(): Promise<Stripe.Price[]> {
    const prices = await this.stripe.prices.list({ active: true, expand: ['data.product'] });
    return prices.data;
  }

  constructWebhookEvent(rawBody: string | Buffer, sig: string | string[], secret: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(rawBody, sig, secret);
  }

  async getCustomerIdFromSubscription(subscriptionId: string): Promise<string | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription.customer as string;
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error);
      return null;
    }
  }

  async createBillingPortalSession(customerId: string): Promise<Stripe.BillingPortal.Session> {
    return await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/dashboard/subscription`,
    });
  }

  static redirectToCheckout(sessionId: string): void {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!).then((clientStripe) => {
      clientStripe?.redirectToCheckout({ sessionId });
    });
  }

  private async getPrice(priceId: string): Promise<Stripe.Price> {
    return this.stripe.prices.retrieve(priceId);
  }

  private buildCheckoutSessionData(
    priceId: string,
    plan: string,
    userId: string,
    origin: string,
    recurringInterval: Stripe.Price.Recurring.Interval,
    freeTrial?: number,
    currency?: string,
    unitAmount?: number | null
  ): Stripe.Checkout.SessionCreateParams {
    const sessionData: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [this.buildLineItem(priceId, plan, recurringInterval, currency, unitAmount)],
      mode: 'subscription',
      success_url: `${origin}/payments?status=success`,
      cancel_url: `${origin}/payments?status=cancel`,
      metadata: { userId, plan },
    };

    if (freeTrial) {
      sessionData.subscription_data = { trial_period_days: freeTrial };
    }

    return sessionData;
  }

  private buildLineItem(
    priceId: string,
    plan: string,
    recurringInterval: Stripe.Price.Recurring.Interval,
    currency?: string,
    unitAmount?: number | null
  ): Stripe.Checkout.SessionCreateParams.LineItem {
    if (!currency || !unitAmount) {
      return { price: priceId, quantity: 1 };
    }

    return {
      price_data: {
        currency,
        product_data: { name: plan },
        recurring: { interval: recurringInterval },
        unit_amount: calculateCurrencyAmount(String(unitAmount), currency),
      },
      quantity: 1,
    };
  }
}
