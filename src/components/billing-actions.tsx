"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSessionAction, createPortalSessionAction } from "@/lib/actions/stripe";

interface BillingActionsProps {
  isActive: boolean;
}

export function BillingActions({ isActive }: BillingActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleCheckout = () => {
    startTransition(async () => {
      const result = await createCheckoutSessionAction();
      if (result?.url) {
        window.location.href = result.url;
      }
    });
  };

  const handlePortal = () => {
    startTransition(async () => {
      const result = await createPortalSessionAction();
      if (result?.url) {
        window.location.href = result.url;
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {!isActive ? (
        <Button onClick={handleCheckout} disabled={isPending}>
          Upgrade to Pro
        </Button>
      ) : (
        <Button variant="outline" onClick={handlePortal} disabled={isPending}>
          Manage subscription
        </Button>
      )}
    </div>
  );
}
