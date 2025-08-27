import { env } from "@/env/client";
import { useChatStore } from "@/lib/chat-store";
import { useChat as useAiChat } from "@ai-sdk/react";
import { useAuthToken } from "@convex-dev/auth/react";
import { DefaultChatTransport } from "ai";

const convexSiteUrl = env.VITE_CONVEX_URL.replace(/.cloud$/, ".site");

type UseChatProps = {
  conversationId?: string;
};

export const useChat = ({ conversationId }: UseChatProps) => {
  const token = useAuthToken();
  const { rerenderTrigger } = useChatStore();

  return useAiChat({
    id: conversationId ?? rerenderTrigger,
    transport: new DefaultChatTransport({
      api: `${convexSiteUrl}/api/chat`,
      headers: { Authorization: `Bearer ${token}` },
    }),
  });
};
