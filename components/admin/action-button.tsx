"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";

/** Runs a server action on click. `confirm` asks first, for destructive actions. */
export function ActionButton({
  action,
  children,
  confirm: confirmText,
  className,
  label,
}: {
  action: () => Promise<void>;
  children: React.ReactNode;
  confirm?: string;
  className?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={pending}
      onClick={() => {
        if (confirmText && !window.confirm(confirmText)) return;
        startTransition(action);
      }}
      className={cn(
        "hover:bg-accent inline-flex h-8 items-center justify-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
