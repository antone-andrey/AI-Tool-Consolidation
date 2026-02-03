"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSessionAction() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id || !session.user.email) {
    redirect("/auth/signin");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: subscription?.stripeCustomerId ?? undefined,
    customer_email: subscription?.stripeCustomerId ? undefined : session.user.email,
    client_reference_id: session.user.id,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID ?? "",
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing?canceled=true`,
  });

  return { url: checkout.url };
}

export async function createPortalSessionAction() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });
  if (!subscription?.stripeCustomerId) {
    return { error: "No customer found." };
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/billing`,
  });

  return { url: portal.url };
}
