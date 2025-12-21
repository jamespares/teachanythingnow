import { stripe } from "./stripe";
import { supabaseAdmin } from "./supabase";

export async function checkSubscriptionStatus(
  customerId: string
): Promise<{
  isActive: boolean;
  subscriptionId?: string;
  currentPeriodEnd?: number;
}> {
  try {
    // First try to get from database (faster)
    const { data: subscription, error } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_subscription_id, current_period_end, status")
      .eq("stripe_customer_id", customerId)
      .eq("status", "active")
      .single();

    if (!error && subscription) {
      // Check if subscription hasn't expired
      const now = Math.floor(Date.now() / 1000);
      if (subscription.current_period_end > now) {
        return {
          isActive: true,
          subscriptionId: subscription.stripe_subscription_id,
          currentPeriodEnd: subscription.current_period_end,
        };
      }
    }

    // Fallback to Stripe API if not in database or expired
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return { isActive: false };
    }

    const stripeSubscription = subscriptions.data[0];
    return {
      isActive: true,
      subscriptionId: stripeSubscription.id,
      currentPeriodEnd: stripeSubscription.current_period_end,
    };
  } catch (error) {
    console.error("Error checking subscription:", error);
    return { isActive: false };
  }
}

export async function getOrCreateStripeCustomer(
  email: string,
  name?: string
): Promise<string> {
  try {
    // Check database first
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("stripe_customer_id")
      .eq("email", email)
      .single();

    if (user?.stripe_customer_id) {
      // Verify customer still exists in Stripe
      try {
        await stripe.customers.retrieve(user.stripe_customer_id);
        return user.stripe_customer_id;
      } catch {
        // Customer doesn't exist in Stripe, create new one
      }
    }

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name: name || email.split("@")[0],
        metadata: {
          createdAt: new Date().toISOString(),
        },
      });
      customerId = customer.id;
    }

    // Sync to database
    await supabaseAdmin
      .from("users")
      .upsert(
        {
          email,
          stripe_customer_id: customerId,
        },
        {
          onConflict: "email",
        }
      );

    return customerId;
  } catch (error) {
    console.error("Error in getOrCreateStripeCustomer:", error);
    // Fallback to Stripe-only approach
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0].id;
    }

    const customer = await stripe.customers.create({
      email,
      name: name || email.split("@")[0],
      metadata: {
        createdAt: new Date().toISOString(),
      },
    });

    return customer.id;
  }
}

