import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

async function handleSubscriptionUpdate(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;

  const userSubscription = await prisma.subscription.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!userSubscription) {
    return;
  }

  await prisma.subscription.update({
    where: { id: userSubscription.id },
    data: {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
      planName: subscription.items.data[0]?.price?.nickname ?? "Pro",
    },
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.customer || !session.client_reference_id) {
        break;
      }
      await prisma.subscription.upsert({
        where: { userId: session.client_reference_id },
        update: {
          stripeCustomerId: session.customer as string,
          status: "active",
          planName: "Pro",
        },
        create: {
          userId: session.client_reference_id,
          stripeCustomerId: session.customer as string,
          status: "active",
          planName: "Pro",
        },
      });
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscriptionUpdate(event);
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
