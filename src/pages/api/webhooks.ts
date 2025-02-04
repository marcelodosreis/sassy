import { NextApiRequest, NextApiResponse } from 'next';

import { stripe } from '@/libs/stripe';
import { supabaseServerClient } from '@/libs/supabase/server';
import { sendEmail } from '@/services/mailgun';
import StripeService from '@/services/stripe';
import SupabaseService from '@/services/supabase';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: NextApiRequest): Promise<string> {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const StripeServiceInstance = new StripeService(stripe);
    const SupabaseServiceInstance = new SupabaseService(supabaseServerClient);

    const sig = req.headers['stripe-signature'];
    const rawBody = await getRawBody(req);

    if (!sig || !endpointSecret) {
      return res.status(400).send('Webhook Error: Missing Stripe signature');
    }

    let event;

    try {
      event = StripeServiceInstance.constructWebhookEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao verificar a assinatura do webhook:', errorMessage);
      return res.status(400).send(`Webhook Error: ${errorMessage}`);
    }
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const session = event.data.object as any;
          const { userId, plan } = session.metadata;

          await SupabaseServiceInstance.upsertSubscription({
            user_id: userId,
            stripe_subscription_id: session.subscription,
            plan,
            status: 'active',
            current_period_start: new Date(session.current_period_start * 1000),
            current_period_end: new Date(session.current_period_end * 1000),
          });
          sendEmail(
            "Mailgun Sandbox <postmaster@sandboxce44f0b8b1e742fa82ec7afee6493fa6.mailgun.org>",
            ["MARCELO H R PAULO <marcelohrpaulo13@gmail.com>"],
            "Hello MARCELO H R PAULO",
            "Congratulations MARCELO H R PAULO, you just sent an email with Mailgun! You are truly awesome!"
          );
          break;
        }

        case 'customer.subscription.updated': {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const subscription = event.data.object as any;

          await SupabaseServiceInstance.updateSubscriptionPeriod(
            subscription.id,
            new Date(subscription.current_period_start * 1000),
            new Date(subscription.current_period_end * 1000)
          );

          await SupabaseServiceInstance.updateSubscriptionStatus(
            subscription.id,
            subscription.status
          );
          break;
        }

        case 'customer.subscription.deleted': {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const subscription = event.data.object as any;
          await SupabaseServiceInstance.cancelSubscription(subscription.id);
          break;
        }

        default:
          console.warn(`Unhandled event type: ${event.type}`);
      }
      res.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook event:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
