export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          MVP Setup
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          AI Spend & ROI OS
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Foundation scaffold for the upcoming AI spend dashboard, interactions
          library, and subscription management.
        </p>
      </div>
      <div className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
        Phase 1 bootstrap complete
      </div>
    </main>
  );
}
