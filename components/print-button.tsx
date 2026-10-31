"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="hover:bg-accent inline-flex h-9 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors"
    >
      <Printer className="size-4" /> Save as PDF
    </button>
  );
}
