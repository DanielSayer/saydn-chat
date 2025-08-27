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

type ChatInputProps = {
  onSubmit: (input: string) => void;
  status: ChatStatus;
};

const models = [{ name: "GPT-5 (mini)", value: "gpt-5-turbo" }];

function ChatInput({ onSubmit, status }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const [model, setModel] = useState(models[0].value);

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
            onValueChange={(value) => {
              setModel(value);
            }}
            value={model}
          >
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              {models.map((model) => (
                <PromptInputModelSelectItem
                  key={model.value}
                  value={model.value}
                >
                  {model.name}
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
