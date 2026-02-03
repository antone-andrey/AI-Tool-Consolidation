"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FREE_TIER_LIMITS, isSubscriptionActive } from "@/lib/subscription";

const toolSchema = z.object({
  name: z.string().min(2),
  iconUrl: z.string().url().optional().or(z.literal("")),
});

export async function createToolAction(data: FormData) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const parsed = toolSchema.safeParse({
    name: data.get("name"),
    iconUrl: data.get("iconUrl"),
  });
  if (!parsed.success) {
    return { error: "Invalid tool details." };
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });
  const toolCount = await prisma.tool.count({
    where: { userId: session.user.id },
  });

  if (!isSubscriptionActive(subscription?.status) && toolCount >= FREE_TIER_LIMITS.tools) {
    return { error: "Free tier limit reached. Upgrade to add more tools." };
  }

  await prisma.tool.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      iconUrl: parsed.data.iconUrl || null,
    },
  });

  return { success: true };
}

export async function deleteToolAction(toolId: string) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  await prisma.tool.delete({
    where: { id: toolId, userId: session.user.id },
  });
}
