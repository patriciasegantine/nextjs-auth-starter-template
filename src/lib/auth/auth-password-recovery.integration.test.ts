import { APIError } from "better-auth/api";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  extractResetToken,
  registerUser,
  uniqueEmail,
} from "@/lib/auth/auth-integration-test-support";

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

describe("password recovery", () => {
  it("resets the password with a valid token and signs in with the new one", async () => {
    const email = uniqueEmail("reset");
    const { verificationToken } = await registerUser(
      auth,
      sendEmailVerificationEmail,
      { email },
    );
    await auth.api.verifyEmail({ query: { token: verificationToken } });

    await auth.api.requestPasswordReset({
      body: { email, redirectTo: "http://localhost:3000/reset-password" },
    });

    const resetUrl = sendPasswordResetEmail.mock.calls.at(-1)?.[0]
      ?.resetUrl as string;
    const resetToken = extractResetToken(resetUrl);

    await auth.api.resetPassword({
      body: { newPassword: "NewPassword1!", token: resetToken },
    });

    const result = await auth.api.signInEmail({
      body: { email, password: "NewPassword1!" },
    });
    expect(result.user.email).toBe(email);
  });

  it("rejects an invalid or expired reset token", async () => {
    await expect(
      auth.api.resetPassword({
        body: { newPassword: "NewPassword1!", token: "not-a-real-token" },
      }),
    ).rejects.toThrow(APIError);
  });

  it("rejects a weak new password via the server-side validation hook", async () => {
    const email = uniqueEmail("weak-reset");
    const { verificationToken } = await registerUser(
      auth,
      sendEmailVerificationEmail,
      { email },
    );
    await auth.api.verifyEmail({ query: { token: verificationToken } });

    await auth.api.requestPasswordReset({
      body: { email, redirectTo: "http://localhost:3000/reset-password" },
    });
    const resetUrl = sendPasswordResetEmail.mock.calls.at(-1)?.[0]
      ?.resetUrl as string;
    const resetToken = extractResetToken(resetUrl);

    await expect(
      auth.api.resetPassword({
        body: { newPassword: "weak", token: resetToken },
      }),
    ).rejects.toThrow(APIError);
  });
});
