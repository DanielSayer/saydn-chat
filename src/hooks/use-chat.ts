import { env } from "@/env/client";
import { useChatStore } from "@/lib/chat-store";
import { useChat as useAiChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useToken } from "./auth-hooks";

const convexSiteUrl = env.VITE_CONVEX_URL.replace(/.cloud$/, ".site");

type UseChatProps = {
  conversationId?: string;
};

export const useChat = ({ conversationId }: UseChatProps) => {
  const { token } = useToken();
  const { rerenderTrigger } = useChatStore();

  return useAiChat({
    id: conversationId ?? rerenderTrigger,
    transport: new DefaultChatTransport({
      api: `${convexSiteUrl}/api/chat`,
      headers: { Authorization: `Bearer ${token}` },
    }),
  });
};
