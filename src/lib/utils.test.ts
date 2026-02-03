import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges conditional classnames", () => {
    const result = cn("text-sm", false && "hidden", "text-sm", "font-semibold");
    expect(result).toBe("text-sm font-semibold");
  });

  it("merges tailwind conflicts", () => {
    const result = cn("text-sm", "text-lg");
    expect(result).toBe("text-lg");
  });
});
