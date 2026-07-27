import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const resetPassword = vi.fn();

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    resetPassword: (...args: unknown[]) => resetPassword(...args),
  },
}));

import { useResetPasswordForm } from "@/hooks/use-reset-password-form";

function submitEvent() {
  return { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
}

function fillValidForm(result: {
  current: ReturnType<typeof useResetPasswordForm>;
}) {
  act(() => {
    result.current.updateField("password", "Abcdef1!");
    result.current.updateField("confirmation", "Abcdef1!");
  });
}

beforeEach(() => {
  resetPassword.mockReset();
});

describe("useResetPasswordForm", () => {
  it("shows an invalid-link error when there is no token", async () => {
    const { result } = renderHook(() => useResetPasswordForm(undefined));
    fillValidForm(result);

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(resetPassword).not.toHaveBeenCalled();
    expect(result.current.feedback).toEqual({
      type: "error",
      message: "This reset link is invalid or expired.",
    });
  });

  it("shows an invalid-link error when the server rejects the token", async () => {
    resetPassword.mockResolvedValue({ error: { status: 400 } });
    const { result } = renderHook(() => useResetPasswordForm("expired-token"));
    fillValidForm(result);

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({
      type: "error",
      message: "This reset link is invalid or expired.",
    });
  });

  it("shows the rate limit message when blocked with a 429", async () => {
    resetPassword.mockResolvedValue({ error: { status: 429 } });
    const { result } = renderHook(() => useResetPasswordForm("valid-token"));
    fillValidForm(result);

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({
      type: "error",
      message: "Too many attempts. Please wait a moment and try again.",
    });
  });

  it("marks the form complete on success", async () => {
    resetPassword.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useResetPasswordForm("valid-token"));
    fillValidForm(result);

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({ type: "complete" });
  });
});
