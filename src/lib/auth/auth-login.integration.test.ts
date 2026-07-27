import { APIError } from "better-auth/api";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { registerUser, uniqueEmail } from "@/lib/auth/auth-integration-test-support";

const sendEmailVerificationEmail = vi.fn();
const sendPasswordResetEmail = vi.fn();
const sendWelcomeEmail = vi.fn();

vi.mock("@/lib/email", () => ({
  sendEmailVerificationEmail: (...args: unknown[]) =>
    sendEmailVerificationEmail(...args),
  sendPasswordResetEmail: (...args: unknown[]) =>
    sendPasswordResetEmail(...args),
  sendWelcomeEmail: (...args: unknown[]) => sendWelcomeEmail(...args),
}));

const { auth } = await import("@/lib/auth");
const { db } = await import("@/lib/db");

beforeEach(() => {
  sendEmailVerificationEmail.mockClear();
  sendPasswordResetEmail.mockClear();
  sendWelcomeEmail.mockClear();
});

afterAll(async () => {
  await db.$disconnect();
});

describe("login", () => {
  it("blocks sign-in with an unverified email", async () => {
    const email = uniqueEmail("unverified");
    await registerUser(auth, sendEmailVerificationEmail, { email });

    await expect(
      auth.api.signInEmail({
        body: { email, password: "Abcdef1!" },
      }),
    ).rejects.toThrow(APIError);
  });

  it("allows sign-in after the email is verified", async () => {
    const email = uniqueEmail("verified");
    const { verificationToken } = await registerUser(
      auth,
      sendEmailVerificationEmail,
      { email },
    );

    await auth.api.verifyEmail({ query: { token: verificationToken } });

    const result = await auth.api.signInEmail({
      body: { email, password: "Abcdef1!" },
    });

    expect(result.user.email).toBe(email);
    expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
  });

  it("rejects the wrong password", async () => {
    const email = uniqueEmail("wrong-password");
    const { verificationToken } = await registerUser(
      auth,
      sendEmailVerificationEmail,
      { email },
    );
    await auth.api.verifyEmail({ query: { token: verificationToken } });

    await expect(
      auth.api.signInEmail({
        body: { email, password: "WrongPassword1!" },
      }),
    ).rejects.toThrow(APIError);
  });
});
