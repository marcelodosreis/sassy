import { NextApiRequest, NextApiResponse } from 'next';

import { supabaseServerClient } from '@/libs/supabase/server';
import SubscriptionServiceInstance from '@/services/subscription';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    try {
      const SubscriptionServiceInstanceInstance = new SubscriptionServiceInstance(supabaseServerClient);
      const subscription = await SubscriptionServiceInstanceInstance.getSubscriptionByUserId(userId);

      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      return res.status(200).json({ subscription });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
