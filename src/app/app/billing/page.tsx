import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSubscriptionActive } from "@/lib/subscription";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BillingActions } from "@/components/billing-actions";

export default async function BillingPage() {
  const session = await getServerSession(authConfig);
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session?.user?.id ?? "" },
  });
  const isActive = isSubscriptionActive(subscription?.status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and payment method.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Plan status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            Current plan: {isActive ? subscription?.planName ?? "Pro" : "Free"}
          </p>
          <p className="text-xs text-muted-foreground">
            Status: {subscription?.status ?? "inactive"}
          </p>
          {subscription?.currentPeriodEnd && (
            <p className="text-xs text-muted-foreground">
              Renews on{" "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}
          <BillingActions isActive={isActive} />
        </CardContent>
      </Card>
    </div>
  );
}
