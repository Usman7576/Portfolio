"use client";

import dynamic from "next/dynamic";

// The chat UI and AI SDK client load in their own chunk after the page is interactive.
const ChatWidget = dynamic(
  () => import("@/components/chat/chat-widget").then((m) => m.ChatWidget),
  {
    ssr: false,
  },
);

export function ChatLauncher() {
  return <ChatWidget />;
}
