"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type FormPasswordFieldProps = {
  id: string;
  label: string;
  name: string;
  value: string;
  autoComplete: string;
  invalid?: boolean;
  error?: string;
  action?: ReactNode;
  onChange: (value: string) => void;
};

export function FormPasswordField({
  id,
  label,
  name,
  value,
  autoComplete,
  invalid = false,
  error,
  action,
  onChange,
}: FormPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label htmlFor={id} className="block text-sm font-medium">
      <span className="mb-2 flex items-center justify-between gap-3">
        <span>{label}</span>
        {action}
      </span>
      <span className="relative block">
        <input
          required
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          aria-invalid={invalid}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-11 w-full rounded-xl border bg-white px-3 pr-11 font-normal transition focus:border-black ${
            invalid ? "border-red-400" : "border-black/15"
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={
            visible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-black/40 transition hover:text-black"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-[18px]" />
          ) : (
            <Eye aria-hidden="true" className="size-[18px]" />
          )}
        </button>
      </span>
      {error && (
        <span id={`${id}-error`} className="mt-1.5 block text-sm text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}
