import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ToolsForm } from "@/components/tools-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteToolAction } from "@/lib/actions/tools";

export default async function ToolsPage() {
  const session = await getServerSession(authConfig);
  const tools = await prisma.tool.findMany({
    where: { userId: session?.user?.id ?? "" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tools</h1>
        <p className="text-sm text-muted-foreground">
          Manage AI tools in your workspace.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Tool list</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tools.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No tools yet. Add your first tool.
                </p>
              )}
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between rounded-md border border-border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{tool.name}</p>
                    <p className="text-xs text-muted-foreground">{tool.iconUrl}</p>
                  </div>
                  <form action={deleteToolAction.bind(null, tool.id)}>
                    <Button variant="outline" type="submit">
                      Remove
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Add tool</CardTitle>
          </CardHeader>
          <CardContent>
            <ToolsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
