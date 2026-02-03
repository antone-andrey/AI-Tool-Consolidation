import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMonth } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpendForm } from "@/components/spend-form";

export default async function SpendPage() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ?? "";
  const currentMonth = formatMonth();

  const [tools, spends] = await Promise.all([
    prisma.tool.findMany({ where: { userId }, select: { id: true, name: true } }),
    prisma.monthlySpend.findMany({
      where: { userId, month: currentMonth },
      include: { tool: true },
      orderBy: { tool: { name: "asc" } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Monthly spend</h1>
        <p className="text-sm text-muted-foreground">
          Track AI tool spend for {currentMonth}.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Current month spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spends.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No spend recorded yet.
                </p>
              )}
              {spends.map((spend) => (
                <div
                  key={spend.id}
                  className="flex items-center justify-between rounded-md border border-border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{spend.tool.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {spend.month}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {spend.currency} {Number(spend.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Update spend</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendForm tools={tools} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
