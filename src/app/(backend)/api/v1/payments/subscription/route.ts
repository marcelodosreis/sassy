import { NextRequest, NextResponse } from "next/server";

import { supabaseServerClient as supabase } from "@/libs/supabase/server";
import SubscriptionService from "@/services/subscription";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid or missing userId");
    }

    const subscriptionService = new SubscriptionService(supabase);
    const subscription = await subscriptionService.getSubscriptionByUserId(
      userId
    );

    if (!subscription) {
      return NextResponse.json({ status: 204 });
    }

    return NextResponse.json(subscription, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
