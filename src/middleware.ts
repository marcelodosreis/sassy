import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { updateSession } from "@/libs/supabase/middleware";
import { createClient } from "@/libs/supabase/server";
import AuthService from "@/services/auth";

async function getUserPlan(
  userId: string
): Promise<"free" | "starter" | "creator" | "pro"> {
  const baseUrl = process.env.NEXT_PUBLIC_PROJECT_URL;
  if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_PROJECT_URL env variable");

  const response = await fetch(
    `${baseUrl}/api/v1/payments/subscription?userId=${userId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const subscription = await response.json();

  if (subscription?.status === "active") {
    return subscription.plan as "starter" | "creator" | "pro";
  }

  return "free";
}

export async function middleware(request: NextRequest) {
  await updateSession(request);

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const supabase = await createClient();
    const authService = new AuthService(supabase);

    const userId = await authService.getUserId();

    if (!userId) {
      const redirectUrl = new URL("/signin", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    const plan = await getUserPlan(userId);

    const response = NextResponse.next();
    response.headers.set("x-shared-data", JSON.stringify({ plan }));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
