"use server";

import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signUpAction(data: FormData) {
  const parsed = signUpSchema.safeParse({
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid sign up details." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: "Email already registered." };
  }

  const password = await hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      password,
    },
  });

  return { success: true };
}

export async function deleteAccountAction() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  await prisma.user.delete({
    where: { id: session.user.id },
  });

  redirect("/");
}
