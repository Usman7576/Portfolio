"use client";

import { useSearchParams } from "next/navigation";

export function LoginError() {
  const error = useSearchParams().get("error");
  if (!error) return null;
  return (
    <p role="alert" className="text-destructive mt-4 text-sm">
      {error === "AccessDenied"
        ? "That GitHub account isn't allowed to manage this site."
        : "Sign-in failed. Please try again."}
    </p>
  );
}
