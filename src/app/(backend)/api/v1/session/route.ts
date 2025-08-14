import { NextResponse } from "next/server";

import { createClient } from "@/libs/supabase/server";
import AuthService from "@/services/auth";

export async function GET() {
  try {
    const supabase = await createClient();
    const authService = new AuthService(supabase);

    const response = await authService.getSession();
    return NextResponse.json({ ...response }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
