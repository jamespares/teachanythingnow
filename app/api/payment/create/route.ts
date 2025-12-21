import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { getOrCreateStripeCustomer } from "@/lib/subscription";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      session.user.email,
      session.user.name || undefined
    );

    // Create Payment Intent for £1.00 (100 pence)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100, // £1.00 in pence
      currency: "gbp",
      customer: customerId,
      metadata: {
        userId: session.user.email,
        topic: topic,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Store payment intent in database
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (user) {
      await supabaseAdmin
        .from("payments")
        .insert({
          user_id: user.id,
          stripe_payment_intent_id: paymentIntent.id,
          stripe_customer_id: customerId,
          amount: 100, // £1.00 in pence
          currency: "gbp",
          status: "pending",
          topic: topic,
        });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}

