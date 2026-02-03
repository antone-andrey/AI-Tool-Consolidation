"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const spendSchema = z.object({
  toolId: z.string().min(1),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.coerce.number().min(0),
  currency: z.string().min(3).max(3).default("EUR"),
});

export async function upsertSpendAction(data: FormData) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const parsed = spendSchema.safeParse({
    toolId: data.get("toolId"),
    month: data.get("month"),
    amount: data.get("amount"),
    currency: data.get("currency") ?? "EUR",
  });
  if (!parsed.success) {
    return { error: "Invalid spend details." };
  }

  await prisma.monthlySpend.upsert({
    where: {
      toolId_month: {
        toolId: parsed.data.toolId,
        month: parsed.data.month,
      },
    },
    update: {
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      userId: session.user.id,
    },
    create: {
      userId: session.user.id,
      toolId: parsed.data.toolId,
      month: parsed.data.month,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
    },
  });

  return { success: true };
}
