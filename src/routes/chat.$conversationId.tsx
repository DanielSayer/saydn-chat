import { Chat } from "@/components/chat";
import { useChatStore } from "@/lib/chat-store";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/chat/$conversationId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { conversationId } = Route.useParams();
  const { setConversationId } = useChatStore();

  useEffect(() => {
    setConversationId(conversationId);
  }, [conversationId]);

  return <Chat conversationId={conversationId} />;
}
