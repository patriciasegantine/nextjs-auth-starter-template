import type { Mock } from "vitest";

type Auth = typeof import("@/lib/auth").auth;

export function uniqueEmail(label: string) {
  return `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

export function extractVerificationToken(url: string) {
  return new URL(url).searchParams.get("token") ?? "";
}

// The reset link points at the `/reset-password/:token` redirect endpoint,
// which relays the same token as a query param after redirecting to the
// app's callback URL. Grab it straight from the path instead of following
// the redirect.
export function extractResetToken(url: string) {
  return new URL(url).pathname.split("/").pop() ?? "";
}

export async function registerUser(
  auth: Auth,
  sendEmailVerificationEmail: Mock,
  { email, password = "Abcdef1!" }: { email: string; password?: string },
) {
  await auth.api.signUpEmail({
    body: { name: "Test User", email, password },
  });

  const call = sendEmailVerificationEmail.mock.calls.at(-1);
  const verificationUrl = call?.[0]?.verificationUrl as string;
  return { verificationToken: extractVerificationToken(verificationUrl) };
}
