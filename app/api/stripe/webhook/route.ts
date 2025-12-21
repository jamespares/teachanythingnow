import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle payment intent events for pay-per-use model
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await syncPaymentToDatabase(paymentIntent);
      break;

    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      await updatePaymentStatus(failedPaymentIntent.id, "failed");
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function syncPaymentToDatabase(paymentIntent: Stripe.PaymentIntent) {
  try {
    if (!paymentIntent.customer) {
      console.error("Payment intent has no customer");
      return;
    }

    // Get customer email
    const customer = await stripe.customers.retrieve(paymentIntent.customer as string);
    if (customer.deleted || !(customer as Stripe.Customer).email) {
      console.error("Customer not found or has no email");
      return;
    }

    const customerEmail = (customer as Stripe.Customer).email!;

    // Get or create user
    let { data: user } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", customerEmail)
      .single();

    if (!user) {
      // Create user if doesn't exist
      const { data: newUser, error: userError } = await supabaseAdmin
        .from("users")
        .insert({
          email: customerEmail,
          stripe_customer_id: paymentIntent.customer as string,
        })
        .select("id")
        .single();

      if (userError) {
        console.error("Error creating user:", userError);
        return;
      }
      user = newUser;
    }

    // Update payment status in database
    const { error: paymentError } = await supabaseAdmin
      .from("payments")
      .update({ status: "succeeded" })
      .eq("stripe_payment_intent_id", paymentIntent.id);

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
    } else {
      console.log(`Payment ${paymentIntent.id} synced to database`);
    }
  } catch (error) {
    console.error("Error in syncPaymentToDatabase:", error);
  }
}

async function updatePaymentStatus(paymentIntentId: string, status: "failed" | "canceled") {
  try {
    const { error } = await supabaseAdmin
      .from("payments")
      .update({ status })
      .eq("stripe_payment_intent_id", paymentIntentId);

    if (error) {
      console.error("Error updating payment status:", error);
    } else {
      console.log(`Payment ${paymentIntentId} status updated to ${status}`);
    }
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
  }
}
