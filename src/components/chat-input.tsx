import type { ChatStatus } from "ai";
import { GlobeIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "./ai-elements/prompt-input";
import { useChatStore } from "@/lib/chat-store";
import { models, type OpenAiModel } from "@/lib/models";

type ChatInputProps = {
  input: string;
  setInput: (input: string) => void;
  onSubmit: (input: string) => void;
  status: ChatStatus;
};

function ChatInput({ onSubmit, status, input, setInput }: ChatInputProps) {
  const [webSearch, setWebSearch] = useState(false);
  const { modelId, setModelId } = useChatStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onSubmit(input);
    setInput("");
  };

  return (
    <PromptInput onSubmit={handleSubmit} className="mx-auto mt-4 max-w-4xl">
      <PromptInputTextarea
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputModelSelect
            onValueChange={(value: OpenAiModel) => {
              setModelId(value);
            }}
            value={modelId}
          >
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              {Object.keys(models).map((id) => (
                <PromptInputModelSelectItem key={id} value={id}>
                  {models[id]}
                </PromptInputModelSelectItem>
              ))}
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>
          <PromptInputButton
            variant={webSearch ? "default" : "ghost"}
            onClick={() => setWebSearch(!webSearch)}
          >
            <GlobeIcon size={16} />
            <span>Search</span>
          </PromptInputButton>
        </PromptInputTools>
        <PromptInputSubmit disabled={!input} status={status} />
      </PromptInputToolbar>
    </PromptInput>
  );
}

export { ChatInput };
