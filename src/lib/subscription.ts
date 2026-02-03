import { prisma } from "@/lib/prisma";

export const FREE_TIER_LIMITS = {
  tools: 3,
  interactionsPerMonth: 30,
};

export async function getUserSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId },
  });
}

export function isSubscriptionActive(status?: string | null) {
  return status === "active" || status === "trialing";
}
