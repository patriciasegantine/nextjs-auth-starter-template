import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const push = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

const signUpEmail = vi.fn();
const signInSocial = vi.fn();

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signUp: {
      email: (...args: unknown[]) => signUpEmail(...args),
    },
    signIn: {
      social: (...args: unknown[]) => signInSocial(...args),
    },
  },
}));

import { useRegistrationForm } from "@/hooks/use-registration-form";

function submitEvent() {
  return { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
}

function fillValidForm(result: { current: ReturnType<typeof useRegistrationForm> }) {
  act(() => {
    result.current.updateField("name", "Ada Lovelace");
    result.current.updateField("email", "ada@example.com");
    result.current.updateField("password", "Abcdef1!");
    result.current.updateField("confirmation", "Abcdef1!");
  });
}

beforeEach(() => {
  push.mockReset();
  refresh.mockReset();
  signUpEmail.mockReset();
  signInSocial.mockReset();
  window.sessionStorage.clear();
});

describe("useRegistrationForm", () => {
  it("flags an invalid name once something has been typed", () => {
    const { result } = renderHook(() => useRegistrationForm());

    act(() => result.current.updateField("name", "Al"));

    expect(result.current.nameInvalid).toBe(true);
    expect(result.current.isValid).toBe(false);
  });

  it("shows account-exists feedback and saves the draft email", async () => {
    signUpEmail.mockResolvedValue({
      error: { code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL", status: 422 },
    });
    const { result } = renderHook(() => useRegistrationForm());
    fillValidForm(result);

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({ type: "account-exists" });
    expect(window.sessionStorage.getItem("auth-starter:email-draft")).toBe(
      "ada@example.com",
    );
  });

  it("shows a generic error for other failures", async () => {
    signUpEmail.mockResolvedValue({
      error: { code: "SOME_OTHER_ERROR", status: 400 },
    });
    const { result } = renderHook(() => useRegistrationForm());
    fillValidForm(result);

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({
      type: "error",
      message: "We could not create your account. Please try again.",
    });
  });

  it("shows the rate limit message when blocked with a 429", async () => {
    signUpEmail.mockResolvedValue({ error: { status: 429 } });
    const { result } = renderHook(() => useRegistrationForm());
    fillValidForm(result);

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(result.current.feedback).toEqual({
      type: "error",
      message: "Too many attempts. Please wait a moment and try again.",
    });
  });

  it("redirects to verify-email on success", async () => {
    signUpEmail.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useRegistrationForm());
    fillValidForm(result);

    await act(async () => {
      await result.current.handleSubmit(submitEvent());
    });

    expect(push).toHaveBeenCalledWith("/verify-email");
    expect(refresh).toHaveBeenCalled();
  });
});
