import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Code2,
  Database,
  FileText,
  Lightbulb,
  Mail,
  Map,
  Sparkles,
} from "lucide-react";
import * as React from "react";

type ChatEmptyStateProps = {
  name: string | undefined;
  onUseExample?: (text: string) => void;
};

type Example = {
  label: string;
  text: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const EXAMPLES: Example[] = [
  {
    label: "Summarize a document",
    text: "Summarize the key points from this document and list action items.",
    icon: FileText,
  },
  {
    label: "Draft an email",
    text: "Draft a friendly email to the product team about the new release notes.",
    icon: Mail,
  },
  {
    label: "Explain this code",
    text: "console.log('Hello world!')",
    icon: Code2,
  },
  {
    label: "Brainstorm ideas",
    text: "Brainstorm 10 creative campaign ideas for a fall product launch.",
    icon: Lightbulb,
  },
  {
    label: "Plan a trip",
    text: "Plan a 3-day itinerary for Tokyo focusing on food, coffee, and design.",
    icon: Map,
  },
  {
    label: "Write a SQL query",
    text: "Write a SQL query to find the top 10 customers by revenue in 2024.",
    icon: Database,
  },
];

export function ChatEmptyState({ onUseExample, name }: ChatEmptyStateProps) {
  const handleUse = React.useCallback(
    async (text: string) => {
      if (onUseExample) {
        onUseExample(text);
        return;
      }
    },
    [onUseExample],
  );

  return (
    <div aria-label="Empty chat state" className="flex h-full w-full">
      <div className="mx-auto my-auto w-full max-w-3xl px-4 pb-20">
        <header className="mb-8 flex flex-col items-center text-center">
          <div
            className={cn(
              "relative mb-4 flex h-12 w-12 items-center justify-center",
              "rounded-2xl bg-gradient-to-br from-violet-500/15 to-emerald-500/15",
              "ring-border ring-1",
            )}
          >
            <Sparkles className="text-foreground/70 h-6 w-6" />
            <div
              className={cn(
                "pointer-events-none absolute -inset-4 -z-10",
                "bg-[radial-gradient(circle_at_center,theme(colors.violet.500/10),transparent_60%)]",
                "blur-2xl",
              )}
            />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {name ? `How can I help you, ${name}?` : "How can I help today?"}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-[48ch] text-sm text-pretty">
            Start a new conversation. Try one of these examples, or ask me
            anything.
          </p>
        </header>

        <section aria-label="Example prompts" className="mb-8">
          <div
            className={cn(
              "grid gap-2",
              "sm:grid-cols-2",
              "md:grid-cols-3 md:gap-3",
            )}
          >
            {EXAMPLES.map((ex) => (
              <ExampleButton key={ex.label} example={ex} onUse={handleUse} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ExampleButton(props: {
  example: Example;
  onUse: (text: string) => void;
}) {
  const { example, onUse } = props;
  const Icon = example.icon;

  return (
    <Button
      variant="secondary"
      className={cn(
        "h-auto justify-start gap-3 rounded-xl p-3 text-left",
        "hover:bg-secondary/80 transition-colors",
      )}
      onClick={() => onUse(example.text)}
    >
      <span className="bg-background ring-border flex h-9 w-9 items-center justify-center rounded-lg ring-1">
        <Icon className="text-foreground/80 h-4 w-4" />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="text-sm font-medium">{example.label}</span>
        <span className="text-muted-foreground text-xs text-wrap">
          {example.text}
        </span>
      </span>
    </Button>
  );
}
