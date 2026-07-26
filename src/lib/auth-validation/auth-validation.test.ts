import { describe, expect, it } from "vitest";
import {
  forgotPasswordSchema,
  loginSchema,
  registrationRequestSchema,
  registrationSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  strongPasswordSchema,
} from "@/lib/auth-validation";

describe("strongPasswordSchema", () => {
  it("accepts a password meeting every rule", () => {
    expect(strongPasswordSchema.safeParse("Abcdef1!").success).toBe(true);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = strongPasswordSchema.safeParse("Ab1!");
    expect(result.success).toBe(false);
  });

  it("rejects a password longer than 128 characters", () => {
    const result = strongPasswordSchema.safeParse(
      `Ab1!${"a".repeat(128)}`,
    );
    expect(result.success).toBe(false);
    expect(
      result.success
        ? undefined
        : result.error.issues.some((issue) =>
            issue.message.includes("no more than 128 characters"),
          ),
    ).toBe(true);
  });

  it("rejects a password missing a lowercase letter", () => {
    const result = strongPasswordSchema.safeParse("ABCDEF1!");
    expect(result.success).toBe(false);
    expect(
      result.success
        ? []
        : result.error.issues.map((issue) => issue.message),
    ).toContain("One lowercase letter");
  });

  it("rejects a password missing an uppercase letter", () => {
    const result = strongPasswordSchema.safeParse("abcdef1!");
    expect(result.success).toBe(false);
    expect(
      result.success
        ? []
        : result.error.issues.map((issue) => issue.message),
    ).toContain("One uppercase letter");
  });

  it("rejects a password missing a number", () => {
    const result = strongPasswordSchema.safeParse("Abcdefg!");
    expect(result.success).toBe(false);
    expect(
      result.success
        ? []
        : result.error.issues.map((issue) => issue.message),
    ).toContain("One number");
  });

  it("rejects a password missing a special character", () => {
    const result = strongPasswordSchema.safeParse("Abcdefg1");
    expect(result.success).toBe(false);
    expect(
      result.success
        ? []
        : result.error.issues.map((issue) => issue.message),
    ).toContain("One special character");
  });

  it("reports every broken rule at once", () => {
    const result = strongPasswordSchema.safeParse("abc");
    expect(result.success).toBe(false);
    expect(
      result.success ? 0 : result.error.issues.length,
    ).toBeGreaterThanOrEqual(4);
  });
});

describe("registrationSchema", () => {
  const validPayload = {
    name: "Ada Lovelace",
    email: "ADA@Example.com",
    password: "Abcdef1!",
    confirmPassword: "Abcdef1!",
  };

  it("accepts a fully valid payload", () => {
    expect(registrationSchema.safeParse(validPayload).success).toBe(true);
  });

  it("lowercases and trims the email", () => {
    const result = registrationSchema.safeParse({
      ...validPayload,
      email: "  ADA@Example.com  ",
    });
    expect(result.success && result.data.email).toBe("ada@example.com");
  });

  it("rejects a name shorter than 3 characters", () => {
    expect(
      registrationSchema.safeParse({ ...validPayload, name: "Al" }).success,
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      registrationSchema.safeParse({ ...validPayload, email: "not-an-email" })
        .success,
    ).toBe(false);
  });

  it("rejects mismatched password confirmation", () => {
    const result = registrationSchema.safeParse({
      ...validPayload,
      confirmPassword: "Different1!",
    });
    expect(result.success).toBe(false);
    expect(
      result.success ? [] : result.error.issues.map((issue) => issue.path),
    ).toContainEqual(["confirmPassword"]);
  });
});

describe("loginSchema", () => {
  it("accepts a valid email and non-empty password", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "x" })
        .success,
    ).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(
      loginSchema.safeParse({ email: "not-an-email", password: "x" }).success,
    ).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "" })
        .success,
    ).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "user@example.com" }).success,
    ).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "not-an-email" }).success,
    ).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts matching strong passwords", () => {
    expect(
      resetPasswordSchema.safeParse({
        password: "Abcdef1!",
        confirmPassword: "Abcdef1!",
      }).success,
    ).toBe(true);
  });

  it("rejects mismatched confirmation", () => {
    expect(
      resetPasswordSchema.safeParse({
        password: "Abcdef1!",
        confirmPassword: "Abcdef2!",
      }).success,
    ).toBe(false);
  });
});

describe("server-side request schemas", () => {
  it("registrationRequestSchema accepts a valid payload without confirmation", () => {
    expect(
      registrationRequestSchema.safeParse({
        name: "Ada Lovelace",
        email: "ada@example.com",
        password: "Abcdef1!",
      }).success,
    ).toBe(true);
  });

  it("resetPasswordRequestSchema rejects a weak password", () => {
    expect(
      resetPasswordRequestSchema.safeParse({ newPassword: "weak" }).success,
    ).toBe(false);
  });
});
