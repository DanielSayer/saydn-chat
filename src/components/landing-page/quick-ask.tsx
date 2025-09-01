import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function QuickAsk(props: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  loading?: boolean;
  examples?: string[];
  onUseExample?: (text: string) => void;
}) {
  const { value, onChange, onSubmit, loading, examples, onUseExample } = props;
  return (
    <div className="space-y-3">
      <form
        onSubmit={onSubmit}
        className="bg-background ring-border flex items-center gap-2 rounded-xl border p-2 ring-1"
      >
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ask a quick question…"
            className="h-11 w-full border-0 bg-transparent pr-12 pl-3 focus-visible:ring-0"
          />
          <kbd
            className={cn(
              "pointer-events-none absolute top-1/2 right-2 -translate-y-1/2",
              "bg-muted rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
              "text-foreground/70",
            )}
          >
            Enter
          </kbd>
        </div>
        <Button
          type="submit"
          disabled={!value.trim() || loading}
          className="h-11"
        >
          Ask
        </Button>
      </form>

      {examples && examples.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <Tooltip key={ex}>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  onClick={() => onUseExample?.(ex)}
                >
                  {ex}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Click to use this</TooltipContent>
            </Tooltip>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { QuickAsk };
