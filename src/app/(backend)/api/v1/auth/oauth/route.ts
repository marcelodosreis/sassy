import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider } = body;

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_PROJECT_URL}/auth/callback?provider=${provider}`,
      },
    });

    if (error) throw error;

    return NextResponse.json({ response: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
