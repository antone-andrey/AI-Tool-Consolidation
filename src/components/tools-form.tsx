"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createToolAction } from "@/lib/actions/tools";

const schema = z.object({
  name: z.string().min(2),
  iconUrl: z.string().url().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function ToolsForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("iconUrl", values.iconUrl ?? "");
      const result = await createToolAction(formData);
      if (result?.error) {
        setError("name", { message: result.error });
        return;
      }
      reset();
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="name">Tool name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="iconUrl">Icon URL (optional)</Label>
        <Input id="iconUrl" {...register("iconUrl")} />
        {errors.iconUrl && (
          <p className="text-xs text-red-600">{errors.iconUrl.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        Add tool
      </Button>
    </form>
  );
}
