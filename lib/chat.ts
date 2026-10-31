import type { UIMessage } from "ai";

/** A page the chatbot's answer drew on, shown as a link under the reply. */
export type ChatSource = { title: string; url: string };

export type ChatMetadata = { sources?: ChatSource[] };

export type ChatUIMessage = UIMessage<ChatMetadata>;

export const MAX_QUESTION_LENGTH = 500;

export const suggestedQuestions = [
  "What has he built?",
  "What's his tech stack?",
  "How does IntelliMeet translate speech?",
];
