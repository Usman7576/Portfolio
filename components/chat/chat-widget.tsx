"use client";

import { useChat } from "@ai-sdk/react";
import { ArrowUp, MessageCircle, Sparkles, Square, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MAX_QUESTION_LENGTH, suggestedQuestions, type ChatUIMessage } from "@/lib/chat";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop, clearError } = useChat<ChatUIMessage>();
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const busy = status === "submitted" || status === "streaming";

  // Keep the newest message in view while an answer streams in.
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages, status]);

  function ask(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    if (error) clearError();
    sendMessage({ text: question.slice(0, MAX_QUESTION_LENGTH) });
    setInput("");
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 print:hidden">
      {open && (
        <section
          id="chat-panel"
          aria-label="Ask about my work"
          className="bg-card mb-3 flex h-[min(34rem,calc(100svh-6rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border shadow-2xl"
        >
          <header className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <Sparkles className="text-primary size-4" /> Ask about my work
              </p>
              <p className="text-muted-foreground text-xs">
                Answers come only from this site&apos;s content.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="hover:bg-accent rounded-md p-1.5"
            >
              <X className="size-4" />
            </button>
          </header>

          <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
            {messages.length === 0 && (
              <div>
                <p className="text-muted-foreground text-sm">
                  Hi! I can answer questions about Usman&apos;s projects, skills and experience.
                </p>
                <div className="mt-4 flex flex-col items-start gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => ask(q)}
                      className="hover:border-primary/50 hover:text-primary rounded-full border px-3 py-1.5 text-left text-sm transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts
                .filter((p) => p.type === "text")
                .map((p) => p.text)
                .join("");
              const mine = m.role === "user";
              return (
                <div key={m.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                      mine
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm",
                    )}
                  >
                    {text ? <FormattedText text={text} /> : busy ? "…" : ""}
                  </div>
                  {!mine && m.metadata?.sources && m.metadata.sources.length > 0 && text && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {m.metadata.sources.map((s) => (
                        <Link
                          key={s.url}
                          href={s.url}
                          className="text-muted-foreground hover:text-primary rounded-md border px-2 py-0.5 text-xs"
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {status === "submitted" && (
              <p className="text-muted-foreground text-sm" role="status">
                Thinking…
              </p>
            )}
            {error && (
              <p role="alert" className="text-destructive text-sm">
                {error.message && error.message.length < 200
                  ? error.message
                  : "Something went wrong. Please try again."}
              </p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-end gap-2 border-t p-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ask(input);
                }
              }}
              rows={1}
              maxLength={MAX_QUESTION_LENGTH}
              placeholder="Ask a question…"
              className="bg-background focus-visible:ring-ring/50 max-h-28 min-h-10 flex-1 resize-none rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
            />
            {busy ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop answer"
                className="hover:bg-accent inline-flex size-10 items-center justify-center rounded-md border"
              >
                <Square className="size-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send question"
                className="bg-primary text-primary-foreground inline-flex size-10 items-center justify-center rounded-md disabled:opacity-50"
              >
                <ArrowUp className="size-4" />
              </button>
            )}
          </form>
        </section>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
          aria-expanded={open}
          aria-controls="chat-panel"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-medium shadow-lg transition-colors"
        >
          {open ? <X className="size-4" /> : <MessageCircle className="size-4" />}
          {open ? "Close" : "Ask about my work"}
        </button>
      </div>
    </div>
  );
}

/** Answers are plain text, but models still use **bold** now and then: render it instead of showing asterisks. */
function FormattedText({ text }: { text: string }) {
  return text
    .split(/(\*\*[^*\n]+\*\*)/g)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    );
}
