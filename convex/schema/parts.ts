import { v } from "convex/values";

export const TextPart = v.object({
  type: v.literal("text"),
  text: v.string(),
});

export const ImagePart = v.object({
  type: v.literal("image"),
  image: v.string(),
  mimeType: v.string(),
});

export const ReasoningPart = v.object({
  type: v.literal("reasoning"),
  reasoning: v.string(),
  duration: v.optional(v.number()),
});

export const FilePart = v.object({
  type: v.literal("file"),
  data: v.string(),
  filename: v.optional(v.string()),
  mimeType: v.optional(v.string()),
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
  ImagePart,
  ReasoningPart,
  FilePart,
  ErrorUIPart,
);
