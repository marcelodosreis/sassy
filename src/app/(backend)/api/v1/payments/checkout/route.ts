import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import PaymentService from "@/services/payment";

interface CheckoutBody {
  priceId: string;
  plan: string;
  userId: string;
  hasFreeTrial?: string;
  currency?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const headersList = headers();
    const origin = (await headersList).get("origin");

    const { priceId, plan, userId, hasFreeTrial, currency } = body;

    if (!priceId || !plan || !userId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const freeTrial = hasFreeTrial ? Number(hasFreeTrial.split("d")?.[0]) : 0;

    const paymentService = new PaymentService(stripe);

    const session = await paymentService.createCheckoutSession(
      priceId,
      plan,
      userId,
      origin as string,
      freeTrial,
      currency
    );

    return NextResponse.json({ id: session.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
