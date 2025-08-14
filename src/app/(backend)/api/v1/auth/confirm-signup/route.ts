import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/libs/supabase/server";
import AuthService from "@/services/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    const supabase = await createClient();
    const authService = new AuthService(supabase);
    const response = await authService.confirmEmail(token, "signup");

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
