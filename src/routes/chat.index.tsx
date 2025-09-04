import { Chat } from "@/components/chat";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const promptSearchSchema = z.object({
  prompt: z.string().optional(),
});

export const Route = createFileRoute("/chat/")({
  component: RouteComponent,
  validateSearch: promptSearchSchema,
});

function RouteComponent() {
  const { prompt } = Route.useSearch();
  return <Chat conversationId={undefined} initialPrompt={prompt} />;
}
