import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@aispendos.com" },
    update: {},
    create: {
      email: "demo@aispendos.com",
      name: "Demo User",
      password,
    },
  });

  const tool = await prisma.tool.upsert({
    where: { id: "demo-tool" },
    update: {},
    create: {
      id: "demo-tool",
      userId: user.id,
      name: "ChatGPT",
    },
  });

  await prisma.monthlySpend.upsert({
    where: {
      toolId_month: { toolId: tool.id, month: "2024-07" },
    },
    update: { amount: 39, currency: "EUR", userId: user.id },
    create: {
      userId: user.id,
      toolId: tool.id,
      month: "2024-07",
      amount: 39,
      currency: "EUR",
    },
  });

  await prisma.aIInteraction.createMany({
    data: [
      {
        userId: user.id,
        toolId: tool.id,
        taskType: "writing",
        prompt: "Draft a product launch email for AI Spend OS.",
        output: "Subject: Launching AI Spend OS...\nBody: ...",
        rating: 4,
      },
      {
        userId: user.id,
        toolId: tool.id,
        taskType: "research",
        prompt: "Summarize AI tool consolidation trends.",
        output: "Key trends include...",
        rating: 5,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
