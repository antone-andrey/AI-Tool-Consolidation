"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInteractionAction } from "@/lib/actions/interactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  toolId: z.string().min(1),
  taskType: z.enum(["writing", "coding", "research", "marketing", "other"]),
  prompt: z.string().min(3),
  output: z.string().min(3),
  rating: z.coerce.number().int().min(1).max(5),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface InteractionFormProps {
  tools: { id: string; name: string }[];
}

export function InteractionForm({ tools }: InteractionFormProps) {
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
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      const result = await createInteractionAction(formData);
      if (result?.error) {
        setError("prompt", { message: result.error });
        return;
      }
      reset();
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
      <div className="space-y-2">
        <Label htmlFor="taskType">Task type</Label>
        <select
          id="taskType"
          className="flex h-10 w-full rounded-md border border-border bg-white px-3 text-sm"
          {...register("taskType")}
        >
          <option value="writing">Writing</option>
          <option value="coding">Coding</option>
          <option value="research">Research</option>
          <option value="marketing">Marketing</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <textarea
          id="prompt"
          className="min-h-[120px] w-full rounded-md border border-border px-3 py-2 text-sm"
          {...register("prompt")}
        />
        {errors.prompt && (
          <p className="text-xs text-red-600">{errors.prompt.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="output">Output</Label>
        <textarea
          id="output"
          className="min-h-[120px] w-full rounded-md border border-border px-3 py-2 text-sm"
          {...register("output")}
        />
        {errors.output && (
          <p className="text-xs text-red-600">{errors.output.message}</p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input id="rating" type="number" min={1} max={5} {...register("rating")} />
          {errors.rating && (
            <p className="text-xs text-red-600">{errors.rating.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Input id="notes" {...register("notes")} />
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        Save interaction
      </Button>
    </form>
  );
}
