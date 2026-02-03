"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FREE_TIER_LIMITS, isSubscriptionActive } from "@/lib/subscription";

const interactionSchema = z.object({
  toolId: z.string().min(1),
  taskType: z.enum(["writing", "coding", "research", "marketing", "other"]),
  prompt: z.string().min(3),
  output: z.string().min(3),
  rating: z.coerce.number().int().min(1).max(5),
  notes: z.string().optional(),
});

function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

export async function createInteractionAction(data: FormData) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const parsed = interactionSchema.safeParse({
    toolId: data.get("toolId"),
    taskType: data.get("taskType"),
    prompt: data.get("prompt"),
    output: data.get("output"),
    rating: data.get("rating"),
    notes: data.get("notes"),
  });
  if (!parsed.success) {
    return { error: "Invalid interaction details." };
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!isSubscriptionActive(subscription?.status)) {
    const { start, end } = getMonthRange();
    const count = await prisma.aIInteraction.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: start, lt: end },
      },
    });
    if (count >= FREE_TIER_LIMITS.interactionsPerMonth) {
      return { error: "Free tier limit reached. Upgrade to log more interactions." };
    }
  }

  await prisma.aIInteraction.create({
    data: {
      userId: session.user.id,
      toolId: parsed.data.toolId,
      taskType: parsed.data.taskType,
      prompt: parsed.data.prompt,
      output: parsed.data.output,
      rating: parsed.data.rating,
      notes: parsed.data.notes || null,
    },
  });

  return { success: true };
}
