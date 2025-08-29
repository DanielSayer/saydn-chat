import { v } from "convex/values";

export const TextPart = v.object({
  type: v.literal("text"),
  text: v.string(),
});

export const ReasoningPart = v.object({
  type: v.literal("reasoning"),
  text: v.string(),
  duration: v.number(),
});

export const SourceUrlPart = v.object({
  type: v.literal("source-url"),
  sourceId: v.string(),
  url: v.string(),
  title: v.optional(v.string()),
});

export const SourceDocumentPart = v.object({
  type: v.literal("source-document"),
  sourceId: v.string(),
  mediaType: v.string(),
  title: v.string(),
  filename: v.optional(v.string()),
});

export const FilePart = v.object({
  type: v.literal("file"),
  url: v.string(),
  filename: v.optional(v.string()),
  mediaType: v.string(),
});

export const ErrorUIPart = v.object({
  type: v.literal("error"),
  error: v.object({
    code: v.string(),
    message: v.string(),
  }),
});

export const MessagePart = v.union(
  TextPart,
  SourceDocumentPart,
  SourceUrlPart,
  ReasoningPart,
  FilePart,
  ErrorUIPart,
);
