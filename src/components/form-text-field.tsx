type FormTextFieldProps = {
  id: string;
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  value: string;
  invalid: boolean;
  error?: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
};

export function FormTextField({
  id,
  label,
  name,
  type,
  autoComplete,
  value,
  invalid,
  error,
  autoFocus = false,
  onChange,
}: FormTextFieldProps) {
  return (
    <label htmlFor={id} className="block text-sm font-medium">
      <span className="mb-2 block">{label}</span>
      <input
        required
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        autoFocus={autoFocus}
        aria-invalid={invalid}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full rounded-xl border bg-white px-3 font-normal transition focus:border-black ${
          invalid ? "border-red-400" : "border-black/15"
        }`}
      />
      {error && (
        <span id={`${id}-error`} className="mt-1.5 block text-sm text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}
