import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

const signInEmail = vi.fn();
const signInSocial = vi.fn();

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: (...args: unknown[]) => signInEmail(...args),
      social: (...args: unknown[]) => signInSocial(...args),
    },
  },
}));

import { useLoginForm } from "@/hooks/use-login-form";

function submitEvent() {
  return { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
}

beforeEach(() => {
  push.mockReset();
  refresh.mockReset();
  signInEmail.mockReset();
  signInSocial.mockReset();
  window.sessionStorage.clear();
});

describe("useLoginForm", () => {
  it("flags an invalid email once something has been typed", () => {
    const { result } = renderHook(() => useLoginForm(""));

    act(() => result.current.updateField("email", "not-an-email"));

    expect(result.current.emailInvalid).toBe(true);
    expect(result.current.isValid).toBe(false);
  });

  it("blocks submit with a validation message when the password is empty", async () => {
    const { result } = renderHook(() => useLoginForm(""));

    act(() => result.current.updateField("email", "user@example.com"));

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(signInEmail).not.toHaveBeenCalled();
    expect(result.current.feedback).toEqual({
      type: "error",
      message: "Enter your password",
    });
  });

  it("redirects to verify-email and saves the draft when the account is unverified", async () => {
    signInEmail.mockResolvedValue({
      error: { code: "EMAIL_NOT_VERIFIED", status: 403 },
    });
    const { result } = renderHook(() => useLoginForm(""));

    act(() => {
      result.current.updateField("email", "user@example.com");
      result.current.updateField("password", "whatever");
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(push).toHaveBeenCalledWith("/verify-email");
    expect(window.sessionStorage.getItem("auth-starter:email-draft")).toBe(
      "user@example.com",
    );
  });

  it("shows a generic message for wrong credentials", async () => {
    signInEmail.mockResolvedValue({
      error: { code: "INVALID_EMAIL_OR_PASSWORD", status: 401 },
    });
    const { result } = renderHook(() => useLoginForm(""));

    act(() => {
      result.current.updateField("email", "user@example.com");
      result.current.updateField("password", "whatever");
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({
      type: "error",
      message: "Incorrect email or password.",
    });
  });

  it("shows the rate limit message when blocked with a 429", async () => {
    signInEmail.mockResolvedValue({
      error: { status: 429, message: "Too many requests." },
    });
    const { result } = renderHook(() => useLoginForm(""));

    act(() => {
      result.current.updateField("email", "user@example.com");
      result.current.updateField("password", "whatever");
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({
      type: "error",
      message: "Too many attempts. Please wait a moment and try again.",
    });
  });

  it("clears the draft and redirects to the session on success", async () => {
    signInEmail.mockResolvedValue({ error: null });
    window.sessionStorage.setItem("auth-starter:email-draft", "user@example.com");
    const { result } = renderHook(() => useLoginForm(""));

    act(() => {
      result.current.updateField("email", "user@example.com");
      result.current.updateField("password", "whatever");
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(window.sessionStorage.getItem("auth-starter:email-draft")).toBeNull();
    expect(push).toHaveBeenCalledWith("/session");
    expect(refresh).toHaveBeenCalled();
  });

  it("surfaces a connection error message when the request throws", async () => {
    signInEmail.mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useLoginForm(""));

    act(() => {
      result.current.updateField("email", "user@example.com");
      result.current.updateField("password", "whatever");
    });

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({
      type: "error",
      message: "We could not sign you in. Check your connection and try again.",
    });
  });

  it("handles Google sign-in errors", async () => {
    signInSocial.mockResolvedValue({
      error: { message: "Google sign-in failed." },
    });
    const { result } = renderHook(() => useLoginForm(""));

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });

    expect(result.current.feedback).toEqual({
      type: "error",
      message: "Google sign-in failed.",
    });
  });
});
