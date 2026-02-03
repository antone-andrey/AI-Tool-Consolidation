import Link from "next/link";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InteractionsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const PAGE_SIZE = 10;

export default async function InteractionsPage({ searchParams }: InteractionsPageProps) {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id ?? "";

  const page = Number(searchParams.page ?? "1");
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const taskType = typeof searchParams.taskType === "string" ? searchParams.taskType : "";
  const toolId = typeof searchParams.toolId === "string" ? searchParams.toolId : "";

  const where = {
    userId,
    ...(taskType ? { taskType } : {}),
    ...(toolId ? { toolId } : {}),
    ...(search
      ? {
          OR: [
            { prompt: { contains: search, mode: "insensitive" } },
            { output: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [tools, interactions, total] = await Promise.all([
    prisma.tool.findMany({ where: { userId }, select: { id: true, name: true } }),
    prisma.aIInteraction.findMany({
      where,
      include: { tool: true },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.aIInteraction.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Interactions</h1>
          <p className="text-sm text-muted-foreground">
            Search, filter, and review prompt history.
          </p>
        </div>
        <Link
          href="/app/interactions/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          New interaction
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4" method="get">
            <input
              name="search"
              placeholder="Search prompt/output"
              defaultValue={search}
              className="rounded-md border border-border px-3 py-2 text-sm"
            />
            <select
              name="taskType"
              defaultValue={taskType}
              className="rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="">All tasks</option>
              <option value="writing">Writing</option>
              <option value="coding">Coding</option>
              <option value="research">Research</option>
              <option value="marketing">Marketing</option>
              <option value="other">Other</option>
            </select>
            <select
              name="toolId"
              defaultValue={toolId}
              className="rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="">All tools</option>
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </select>
            <Button type="submit">Apply</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interactions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No interactions found.
              </p>
            )}
            {interactions.map((interaction) => (
              <div
                key={interaction.id}
                className="rounded-md border border-border p-4 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{interaction.tool.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {interaction.taskType} · Rating {interaction.rating}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(interaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Prompt
                    </p>
                    <p className="mt-1 text-sm">{interaction.prompt}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Output
                    </p>
                    <p className="mt-1 text-sm">{interaction.output}</p>
                  </div>
                </div>
                {interaction.notes && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Notes: {interaction.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`?page=${page - 1}&search=${search}&taskType=${taskType}&toolId=${toolId}`}
                    className="rounded-md border border-border px-3 py-1"
                  >
                    Previous
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`?page=${page + 1}&search=${search}&taskType=${taskType}&toolId=${toolId}`}
                    className="rounded-md border border-border px-3 py-1"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
