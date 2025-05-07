import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

import { stripe } from "@/libs/stripe";
import PaymentService from "@/services/payment";
import { loadTranslationsSSR } from "@/utils/loadTranslationsSSR";
import {
  InputData,
  transformPurchasePlansDTO,
} from "@/utils/transformPurchasePlansDTO";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const locale = (await cookieStore).get("locale")?.value || "en-US";

    const { translate } = await loadTranslationsSSR(locale);
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency");

    if (!currency) {
      throw new Error("Missing Currency");
    }

    const paymentService = new PaymentService(stripe);
    const prices = await paymentService.listActivePrices();

    const response = prices?.map((price) => {
      const product = price.product as Stripe.Product;
      return {
        id: price.id,
        productName: product.name,
        description: product.description,
        interval: price.recurring?.interval,
        amount: ((price.unit_amount || 0) / 100).toFixed(0),
        currency: price.currency,
      };
    });

    const tranform = await transformPurchasePlansDTO(
      response as Array<InputData>,
      translate,
      currency as string
    );

    return NextResponse.json(tranform, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
