import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const provider = searchParams.get('provider');
    const next = searchParams.get('next') ?? '/';

    if (!code || !provider) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PROJECT_URL}/auth/error`);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) throw error;

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PROJECT_URL}${next}`);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_PROJECT_URL}/auth/error`);
  }
}
