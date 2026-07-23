"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PasswordRules } from "@/components/password-rules";

type RegisterPasswordFieldsProps = {
  password: string;
  confirmation: string;
  onPasswordChange: (value: string) => void;
  onConfirmationChange: (value: string) => void;
};

export function RegisterPasswordFields({
  password,
  confirmation,
  onPasswordChange,
  onConfirmationChange,
}: RegisterPasswordFieldsProps) {
  const [visibility, setVisibility] = useState({
    password: false,
    confirmation: false,
  });
  const mismatch = confirmation.length > 0 && password !== confirmation;
  const passwordsMatch =
    confirmation.length > 0 && password === confirmation;

  return (
    <div className="space-y-4">
      <PasswordField
        id="register-password"
        label="Password"
        name="password"
        value={password}
        visible={visibility.password}
        onChange={onPasswordChange}
        onVisibilityChange={() =>
          setVisibility((current) => ({
            ...current,
            password: !current.password,
          }))
        }
      />
      <PasswordField
        id="register-password-confirmation"
        label="Confirm password"
        name="confirmation"
        value={confirmation}
        visible={visibility.confirmation}
        invalid={mismatch}
        onChange={onConfirmationChange}
        onVisibilityChange={() =>
          setVisibility((current) => ({
            ...current,
            confirmation: !current.confirmation,
          }))
        }
      />
      {mismatch && (
        <p className="-mt-2 text-sm text-red-700" role="alert">
          Passwords do not match.
        </p>
      )}
      <PasswordRules
        password={password}
        passwordsMatch={passwordsMatch}
      />
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  name: string;
  value: string;
  visible: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
  onVisibilityChange: () => void;
};

function PasswordField({
  id,
  label,
  name,
  value,
  visible,
  invalid = false,
  onChange,
  onVisibilityChange,
}: PasswordFieldProps) {
  return (
    <label htmlFor={id} className="block text-sm font-medium">
      <span className="mb-2 block">{label}</span>
      <span className="relative block">
        <input
          required
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="new-password"
          aria-invalid={invalid}
          className={`h-11 w-full rounded-xl border bg-white px-3 pr-11 font-normal transition focus:border-black ${
            invalid ? "border-red-400" : "border-black/15"
          }`}
        />
        <button
          type="button"
          onClick={onVisibilityChange}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-black/40 transition hover:text-black"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-[18px]" />
          ) : (
            <Eye aria-hidden="true" className="size-[18px]" />
          )}
        </button>
      </span>
    </label>
  );
}
