// Small building blocks shared by the admin forms.

export const inputClass =
  "bg-background focus-visible:ring-ring/50 aria-invalid:border-destructive w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2";

export function Field({
  label,
  name,
  hint,
  error,
  children,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      {children}
      {error && (
        <p id={`${name}-error`} className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({
  name,
  defaultValue,
  error,
  ...rest
}: { name: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      id={name}
      name={name}
      defaultValue={defaultValue}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      className={inputClass}
      {...rest}
    />
  );
}

export function TextArea({
  name,
  defaultValue,
  error,
  rows = 4,
  ...rest
}: { name: string; error?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      id={name}
      name={name}
      rows={rows}
      defaultValue={defaultValue}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`${inputClass} resize-y`}
      {...rest}
    />
  );
}

export function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="accent-primary size-4"
      />
      {label}
    </label>
  );
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center rounded-md px-5 text-sm font-medium disabled:opacity-70"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}
