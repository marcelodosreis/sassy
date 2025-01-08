import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { updateSession } from './lib/supabase/middleware';
import { createClient } from './lib/supabase/server';
import AuthService from './services/auth';

export async function middleware(request: NextRequest) {
  await updateSession(request);
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/dashboard')) {
    const supabase = await createClient();
    const AuthServiceInstance = new AuthService(supabase);

    const userId = await AuthServiceInstance.getUserSessionId();
    const searchCode = url.searchParams.get('code');


    if(searchCode) {
      const redirectUrl = new URL('/dashboard', request.url);
      return NextResponse.rewrite(redirectUrl);
    }

    if (!userId) {
      const redirectUrl = new URL('/signin', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};