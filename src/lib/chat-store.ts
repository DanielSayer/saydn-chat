import { create } from "zustand";
import { DEFAULT_MODEL, type OpenAiModel } from "./models";

type ChatState = {
  conversationId: string | undefined;
  modelId: OpenAiModel;
};

type ChatActions = {
  setModelId: (modelId: OpenAiModel) => void;
  setConversationId: (conversationId: string | undefined) => void;
  resetChat: () => void;
};

const initialState: ChatState = {
  conversationId: undefined,
  modelId:
    (window.localStorage.getItem("modelId") as OpenAiModel) ?? DEFAULT_MODEL,
};

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  ...initialState,
  setModelId: (modelId) => {
    window.localStorage.setItem("modelId", modelId);
    set({ modelId });
  },
  setConversationId: (conversationId) => set({ conversationId }),
  resetChat: () => {
    set({ ...initialState });
  },
}));
