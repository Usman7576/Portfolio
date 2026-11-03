"use client";

import { useEffect, useRef, useState } from "react";

const MAX_PIXEL_RATIO = 2;

/**
 * Draws the uploaded PDF with PDF.js. Browser PDF embeds don't work on many phones, so this
 * shows the same pages everywhere. PDF.js is imported here, so only the resume page loads it.
 */
export function ResumeViewer({ url }: { url: string }) {
  const pages = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [text, setText] = useState("");

  useEffect(() => {
    const container = pages.current;
    if (!container) return;
    let cancelled = false;

    (async () => {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();

      const loadingTask = pdfjs.getDocument({ url });
      const doc = await loadingTask.promise;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      const canvases: HTMLCanvasElement[] = [];
      const pageTexts: string[] = [];

      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n);
        const scale = (container.clientWidth * pixelRatio) / page.getViewport({ scale: 1 }).width;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.className = "h-auto w-full rounded-lg border bg-white shadow-sm";
        canvas.setAttribute("aria-hidden", "true");
        await page.render({ canvas, viewport }).promise;
        canvases.push(canvas);

        const content = await page.getTextContent();
        pageTexts.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
        if (cancelled) return;
      }

      container.replaceChildren(...canvases);
      setText(pageTexts.join("\n\n"));
      setStatus("ready");
      await loadingTask.destroy();
    })().catch((e) => {
      console.error("[resume] could not display the PDF", e);
      if (!cancelled) setStatus("error");
    });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div>
      {status === "loading" && (
        <div
          role="status"
          className="bg-muted/40 text-muted-foreground flex aspect-[8.5/11] w-full items-center justify-center rounded-lg border text-sm"
        >
          Loading resume…
        </div>
      )}
      {status === "error" && (
        <p role="alert" className="rounded-lg border p-6 text-sm">
          The preview couldn&apos;t load here.{" "}
          <a href={url} className="text-primary font-medium underline">
            Open the resume PDF
          </a>{" "}
          instead.
        </p>
      )}
      <div ref={pages} className="space-y-4" />
      {/* The pages are images, so the same text is available to screen readers. */}
      {text && <div className="sr-only whitespace-pre-line">{text}</div>}
    </div>
  );
}
