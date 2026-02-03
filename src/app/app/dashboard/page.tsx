import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMonth, monthRange } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ?? "";
  const currentMonth = formatMonth();
  const { start, end } = monthRange();

  const [spends, interactions, toolRatings, tools] = await Promise.all([
    prisma.monthlySpend.findMany({
      where: { userId, month: currentMonth },
      include: { tool: true },
    }),
    prisma.aIInteraction.findMany({
      where: { userId, createdAt: { gte: start, lt: end } },
      include: { tool: true },
    }),
    prisma.aIInteraction.groupBy({
      by: ["toolId"],
      where: { userId, createdAt: { gte: start, lt: end } },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.tool.findMany({ where: { userId } }),
  ]);

  const totalSpend = spends.reduce((sum, spend) => sum + Number(spend.amount), 0);
  const totalInteractions = interactions.length;

  const ratingsByTool = toolRatings.map((rating) => ({
    toolId: rating.toolId,
    avgRating: rating._avg.rating ?? 0,
    count: rating._count._all,
  }));

  const topRated = ratingsByTool
    .filter((entry) => entry.count >= 3)
    .sort((a, b) => b.avgRating - a.avgRating)[0];

  const wastedSpend = spends.reduce((sum, spend) => {
    const rating = ratingsByTool.find((entry) => entry.toolId === spend.toolId);
    if (!rating || rating.count < 3 || rating.avgRating < 3) {
      return sum + Number(spend.amount);
    }
    return sum;
  }, 0);

  const insights: string[] = [];
  if (totalSpend > 0 && totalInteractions === 0) {
    insights.push("You have spend recorded but no interactions logged yet.");
  }
  if (wastedSpend > 0) {
    insights.push(
      `€${wastedSpend.toFixed(2)} is tied to tools with low or limited usage.`
    );
  }
  if (topRated) {
    const toolName = tools.find((tool) => tool.id === topRated.toolId)?.name;
    insights.push(`Top rated tool: ${toolName ?? "Unknown"} this month.`);
  }
  if (totalInteractions < 10) {
    insights.push("Log more prompts to improve your ROI visibility.");
  }
  if (insights.length === 0) {
    insights.push("Healthy usage. Keep tracking spend and interactions.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview for {currentMonth}.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total spend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">€{totalSpend.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalInteractions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Wasted spend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">€{wastedSpend.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            {insights.map((insight) => (
              <li key={insight}>{insight}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average rating per tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ratingsByTool.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No interactions logged yet.
              </p>
            )}
            {ratingsByTool.map((rating) => {
              const tool = tools.find((item) => item.id === rating.toolId);
              return (
                <Badge key={rating.toolId}>
                  {tool?.name ?? "Unknown"} · {rating.avgRating.toFixed(1)} (
                  {rating.count})
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
