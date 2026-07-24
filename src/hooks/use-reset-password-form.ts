"use client";

import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema } from "@/lib/auth-validation";

type ResetPasswordFeedback =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "complete" }
  | { type: "error"; message: string };

export function useResetPasswordForm(token?: string) {
  const [formData, setFormData] = useState({
    password: "",
    confirmation: "",
  });
  const [feedback, setFeedback] = useState<ResetPasswordFeedback>({
    type: "idle",
  });

  const validation = resetPasswordSchema.safeParse({
    password: formData.password,
    confirmPassword: formData.confirmation,
  });

  function updateField(field: keyof typeof formData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
    setFeedback({ type: "idle" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setFeedback({
        type: "error",
        message: "This reset link is invalid or expired.",
      });
      return;
    }

    const result = resetPasswordSchema.safeParse({
      password: formData.password,
      confirmPassword: formData.confirmation,
    });

    if (!result.success) {
      setFeedback({
        type: "error",
        message: result.error.issues[0]?.message ?? "Check your password.",
      });
      return;
    }

    setFeedback({ type: "submitting" });

    try {
      const resetResult = await authClient.resetPassword({
        newPassword: result.data.password,
        token,
      });

      if (resetResult.error) {
        setFeedback({
          type: "error",
          message: "This reset link is invalid or expired.",
        });
        return;
      }

      setFeedback({ type: "complete" });
    } catch {
      setFeedback({
        type: "error",
        message:
          "We could not update your password. Check your connection and try again.",
      });
    }
  }

  return {
    formData,
    feedback,
    isValid: validation.success,
    updateField,
    handleSubmit,
  };
}
