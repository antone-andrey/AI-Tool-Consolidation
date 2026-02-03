import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authConfig } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/app/dashboard" className="text-sm font-semibold">
            AI Spend & ROI OS
          </Link>
          <nav className="flex items-center gap-3 text-sm text-muted-foreground">
            <Link href="/app/dashboard">Dashboard</Link>
            <Link href="/app/interactions">Interactions</Link>
            <Link href="/app/tools">Tools</Link>
            <Link href="/app/spend">Spend</Link>
            <Link href="/app/billing">Billing</Link>
            <Link href="/app/settings">Settings</Link>
            <form action="/api/auth/signout" method="post">
              <Button variant="outline" type="submit">
                Logout
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
