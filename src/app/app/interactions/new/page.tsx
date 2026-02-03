import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InteractionForm } from "@/components/interaction-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewInteractionPage() {
  const session = await getServerSession(authConfig);
  const tools = await prisma.tool.findMany({
    where: { userId: session?.user?.id ?? "" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New interaction</h1>
        <p className="text-sm text-muted-foreground">
          Log a prompt, output, and rating.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Interaction details</CardTitle>
        </CardHeader>
        <CardContent>
          <InteractionForm tools={tools} />
        </CardContent>
      </Card>
    </div>
  );
}
