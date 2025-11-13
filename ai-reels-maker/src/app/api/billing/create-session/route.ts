import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!stripeKey || !priceId) {
    return NextResponse.json({
      url: "",
      message:
        "Stripe not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID to enable live checkout.",
    });
  }

  // In production this would call Stripe's API. We return a placeholder to keep the template deployable.
  return NextResponse.json({
    url: `https://buy.stripe.com/test_${priceId}`,
  });
}

