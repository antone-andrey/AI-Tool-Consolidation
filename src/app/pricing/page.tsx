import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-10 px-6 py-12 text-center">
      <div>
        <h1 className="text-3xl font-semibold">Simple pricing</h1>
        <p className="mt-3 text-muted-foreground">
          Start free. Upgrade when you need unlimited interactions and tools.
        </p>
      </div>
      <div className="grid w-full gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-6 text-left shadow-sm">
          <h2 className="text-lg font-semibold">Free</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            3 tools, 30 interactions per month.
          </p>
          <p className="mt-4 text-3xl font-semibold">€0</p>
          <Link
            href="/auth/signup"
            className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Start free
          </Link>
        </div>
        <div className="rounded-lg border border-border bg-white p-6 text-left shadow-sm">
          <h2 className="text-lg font-semibold">Pro</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Unlimited tools and interactions.
          </p>
          <p className="mt-4 text-3xl font-semibold">€29</p>
          <Link
            href="/auth/signup"
            className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium"
          >
            Upgrade in app
          </Link>
        </div>
      </div>
    </main>
  );
}
