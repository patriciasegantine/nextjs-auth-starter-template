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

describe("registration", () => {
  it("creates an unverified user and sends a verification email", async () => {
    const email = uniqueEmail("register");

    const result = await auth.api.signUpEmail({
      body: { name: "Test User", email, password: "Abcdef1!" },
    });

    expect(result.user.email).toBe(email);
    expect(result.user.emailVerified).toBe(false);
    expect(sendEmailVerificationEmail).toHaveBeenCalledTimes(1);
    expect(sendEmailVerificationEmail.mock.calls[0][0]).toMatchObject({
      to: email,
    });
  });

  it("rejects a weak password via the server-side validation hook", async () => {
    const email = uniqueEmail("weak-password");

    await expect(
      auth.api.signUpEmail({
        body: { name: "Test User", email, password: "weak" },
      }),
    ).rejects.toThrow(APIError);

    expect(sendEmailVerificationEmail).not.toHaveBeenCalled();
  });

  it("does not send a new verification email for an already-registered address", async () => {
    // better-auth returns a generic "success" response for a duplicate
    // sign-up (instead of an error) when requireEmailVerification is on,
    // to avoid leaking which emails already have an account. No new user
    // row is created and no email is sent for the second attempt.
    const email = uniqueEmail("duplicate");
    await registerUser(auth, sendEmailVerificationEmail, { email });
    expect(sendEmailVerificationEmail).toHaveBeenCalledTimes(1);

    await auth.api.signUpEmail({
      body: { name: "Test User", email, password: "Abcdef1!" },
    });

    expect(sendEmailVerificationEmail).toHaveBeenCalledTimes(1);
  });
});
