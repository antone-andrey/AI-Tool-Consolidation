"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertSpendAction } from "@/lib/actions/spend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  toolId: z.string().min(1),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.coerce.number().min(0),
  currency: z.string().min(3).max(3),
});

type FormValues = z.infer<typeof schema>;

interface SpendFormProps {
  tools: { id: string; name: string }[];
}

export function SpendForm({ tools }: SpendFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currency: "EUR" },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      const result = await upsertSpendAction(formData);
      if (result?.error) {
        setError("amount", { message: result.error });
        return;
      }
      reset({ amount: 0, month: values.month, toolId: values.toolId, currency: values.currency });
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="toolId">Tool</Label>
        <select
          id="toolId"
          className="flex h-10 w-full rounded-md border border-border bg-white px-3 text-sm"
          {...register("toolId")}
        >
          <option value="">Select a tool</option>
          {tools.map((tool) => (
            <option key={tool.id} value={tool.id}>
              {tool.name}
            </option>
          ))}
        </select>
        {errors.toolId && (
          <p className="text-xs text-red-600">{errors.toolId.message}</p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="month">Month (YYYY-MM)</Label>
          <Input id="month" placeholder="2024-07" {...register("month")} />
          {errors.month && (
            <p className="text-xs text-red-600">{errors.month.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" step="0.01" {...register("amount")} />
          {errors.amount && (
            <p className="text-xs text-red-600">{errors.amount.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Input id="currency" {...register("currency")} />
      </div>
      <Button type="submit" disabled={isPending}>
        Save spend
      </Button>
    </form>
  );
}
