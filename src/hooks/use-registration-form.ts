"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { registrationSchema } from "@/lib/auth-validation";

type FormField = "name" | "email" | "password" | "confirmation";
type FormFeedback =
  | { type: "idle" | "submitting" | "account-exists" }
  | { type: "error"; message: string };

const initialFormData: Record<FormField, string> = {
  name: "",
  email: "",
  password: "",
  confirmation: "",
};

export function useRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [feedback, setFeedback] = useState<FormFeedback>({ type: "idle" });

  const validation = registrationSchema.safeParse({
    name: formData.name,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmation,
  });
  const nameInvalid =
    formData.name.length > 0 && formData.name.trim().length < 3;
  const emailInvalid =
    formData.email.length > 0 &&
    !registrationSchema.shape.email.safeParse(formData.email).success;

  function updateField(field: FormField, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
    setFeedback({ type: "idle" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback({ type: "submitting" });

    const result = registrationSchema.safeParse({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmation,
    });

    if (!result.success) {
      setFeedback({
        type: "error",
        message: result.error.issues[0]?.message ?? "Check your details.",
      });
      return;
    }

    try {
      const signUpResult = await authClient.signUp.email({
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      });

      if (signUpResult.error) {
        setFeedback(
          signUpResult.error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
            ? { type: "account-exists" }
            : {
                type: "error",
                message: "We could not create your account. Please try again.",
              },
        );
        return;
      }

      router.push("/session");
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        message:
          "We could not create your account. Check your connection and try again.",
      });
    }
  }

  return {
    formData,
    feedback,
    isValid: validation.success,
    nameInvalid,
    emailInvalid,
    updateField,
    handleSubmit,
  };
}
