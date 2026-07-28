import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const requestPasswordReset = vi.fn();

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    requestPasswordReset: (...args: unknown[]) =>
      requestPasswordReset(...args),
  },
}));

import { useForgotPasswordForm } from "@/hooks/use-forgot-password-form";

function submitEvent() {
  return { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
}

beforeEach(() => {
  requestPasswordReset.mockReset();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useForgotPasswordForm", () => {
  it("flags an invalid email once something has been typed", () => {
    const { result } = renderHook(() => useForgotPasswordForm(""));

    act(() => result.current.updateEmail("not-an-email"));

    expect(result.current.emailInvalid).toBe(true);
    expect(result.current.isValid).toBe(false);
  });

  it("sets feedback to sent and starts the cooldown on success", async () => {
    requestPasswordReset.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useForgotPasswordForm(""));

    act(() => result.current.updateEmail("user@example.com"));

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({ type: "sent" });
    expect(result.current.cooldown).toBe(60);
  });

  it("counts the cooldown down to zero", async () => {
    requestPasswordReset.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useForgotPasswordForm(""));

    act(() => result.current.updateEmail("user@example.com"));
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    act(() => vi.advanceTimersByTime(60_000));

    expect(result.current.cooldown).toBe(0);
  });

  it("shows the rate limit message when blocked with a 429", async () => {
    requestPasswordReset.mockResolvedValue({ error: { status: 429 } });
    const { result } = renderHook(() => useForgotPasswordForm(""));

    act(() => result.current.updateEmail("user@example.com"));
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({
      type: "error",
      message: "Too many attempts. Please wait a moment and try again.",
    });
  });

  it("shows a generic error for other failures", async () => {
    requestPasswordReset.mockResolvedValue({
      error: { status: 500 },
    });
    const { result } = renderHook(() => useForgotPasswordForm(""));

    act(() => result.current.updateEmail("user@example.com"));
    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({
      type: "error",
      message: "We could not process the request. Please try again.",
    });
  });
});
