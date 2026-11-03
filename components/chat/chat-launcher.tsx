"use client";

import { Loader2, MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const loadWidget = () => import("@/components/chat/chat-widget");

const ChatWidget = dynamic(() => loadWidget().then((m) => m.ChatWidget), {
  ssr: false,
  loading: () => <LauncherButton loading />,
});

function LauncherButton({
  loading,
  onClick,
  onPointerEnter,
}: {
  loading?: boolean;
  onClick?: () => void;
  onPointerEnter?: () => void;
}) {
  return (
    <div className="fixed right-4 bottom-4 z-50 print:hidden">
      <button
        type="button"
        disabled={loading}
        onClick={onClick}
        onPointerEnter={onPointerEnter}
        onFocus={onPointerEnter}
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-medium shadow-lg transition-colors"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <MessageCircle className="size-4" />
        )}
        Ask about my work
      </button>
    </div>
  );
}

// The chat UI and AI SDK download only when someone reaches for the button, so they never
// slow down a page for visitors who don't use the chat.
export function ChatLauncher() {
  const [activated, setActivated] = useState(false);
  if (activated) return <ChatWidget />;
  return <LauncherButton onClick={() => setActivated(true)} onPointerEnter={loadWidget} />;
}
