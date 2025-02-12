import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { updateSession } from '@/libs/supabase/middleware';
import { createClient } from '@/libs/supabase/server';
import AuthService from '@/services/auth';

export async function middleware(request: NextRequest) {
  await updateSession(request);
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/dashboard')) {
    const supabase = await createClient();
    const AuthServiceInstance = new AuthService(supabase);

    const userId = await AuthServiceInstance.getUserId();

    if (!userId) {
      const redirectUrl = new URL('/signin', request.url);
      return NextResponse.redirect(redirectUrl);
    }


    const subscriptionRequest = await fetch(
      `${process.env.NEXT_PUBLIC_PROJECT_URL}/api/payments/get-subscription?userId=${userId}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    if (!subscriptionRequest.ok) {
      console.error('Failed to fetch subscription:', subscriptionRequest.statusText);
      return null;
    }

    const data = await subscriptionRequest.json();
    const subscription = data.subscription;

    const plan = subscription &&
      subscription?.status === 'active'
      ? subscription.plan as 'starter' | 'creator' | 'pro'
      : 'free'

    const res = NextResponse.next();
    res.headers.set('x-shared-data', JSON.stringify({ plan }));
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};