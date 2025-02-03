import { NextApiRequest, NextApiResponse } from 'next';

import { stripe } from '@/libs/stripe';
import StripeService from '@/services/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).setHeader('Allow', 'POST').end('Method Not Allowed');
  }

  const { priceId, plan, userId, hasFreeTrial, currency } = req.body;

  if (!priceId || !plan || !userId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const freeTrial = hasFreeTrial ? Number(hasFreeTrial.split('d')?.[0]) : 0;

  try {
    const stripeServiceInstance = new StripeService(stripe);
    const session = await stripeServiceInstance.createCheckoutSession(
      priceId,
      plan,
      userId,
      req.headers.origin as string,
      freeTrial,
      currency
    );

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}
