"use client";

import { Upload } from "lucide-react";
import { useState } from "react";
import { getUploadSignature } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/admin/form-fields";

/** Image URL field. With Cloudinary configured, it can also upload a file and fill in the URL. */
export function ImageField({
  name,
  label,
  defaultValue,
  error,
  canUpload,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  error?: string;
  canUpload: boolean;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<string | null>(null);

  async function upload(file: File) {
    setStatus("Uploading…");
    try {
      const sig = await getUploadSignature();
      const body = new FormData();
      body.append("file", file);
      body.append("api_key", sig.apiKey);
      body.append("timestamp", String(sig.timestamp));
      body.append("folder", sig.folder);
      body.append("signature", sig.signature);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
        method: "POST",
        body,
      });
      const json = (await res.json()) as { secure_url?: string; error?: { message: string } };
      if (!res.ok || !json.secure_url) throw new Error(json.error?.message ?? "Upload failed");
      setUrl(json.secure_url);
      setStatus(null);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Upload failed");
    }
  }

  return (
    <Field
      label={label}
      name={name}
      error={error}
      hint={
        canUpload
          ? "Paste a URL or upload an image."
          : "Paste an image URL (uploads need Cloudinary keys)."
      }
    >
      <div className="flex gap-2">
        <input
          id={name}
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          aria-invalid={!!error}
          className={inputClass}
        />
        {canUpload && (
          <label className="hover:bg-accent inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm">
            <Upload className="size-4" /> Upload
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="sr-only"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
          </label>
        )}
      </div>
      {status && <p className="text-muted-foreground text-xs">{status}</p>}
      {url && /^https?:\/\//.test(url) && (
        // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an arbitrary URL
        <img src={url} alt="" className="mt-2 max-h-40 rounded-md border object-cover" />
      )}
    </Field>
  );
}
