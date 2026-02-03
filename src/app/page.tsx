import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          AI Spend & ROI OS
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Consolidate AI tools. Control ROI.
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Track monthly spend, log prompts, and surface ROI-lite insights in a
          single workspace built for fast-moving teams.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/auth/signup"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Start free
        </Link>
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium"
        >
          View pricing
        </Link>
      </div>
    </main>
  );
}
