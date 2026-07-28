import { describe, expect, it } from "vitest";
import { isRateLimitError } from "@/lib/auth-error";

describe("isRateLimitError", () => {
  it("returns true for a 429 status", () => {
    expect(isRateLimitError({ status: 429 })).toBe(true);
  });

  it("returns false for other status codes", () => {
    expect(isRateLimitError({ status: 401 })).toBe(false);
    expect(isRateLimitError({ status: 500 })).toBe(false);
  });

  it("returns false when there is no status", () => {
    expect(isRateLimitError({})).toBe(false);
  });
});
