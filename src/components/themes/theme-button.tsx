import { extractThemeColors, FetchedTheme } from "@/lib/theme-utils";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

type ThemeButtonProps = {
  theme: FetchedTheme;
  isSelected: boolean;
  onSelect: (theme: FetchedTheme) => void;
  currentMode: "light" | "dark";
};

function ThemeButton({
  theme,
  isSelected,
  onSelect,
  currentMode,
}: ThemeButtonProps) {
  const colors =
    "error" in theme && theme.error
      ? []
      : "preset" in theme
        ? extractThemeColors(theme.preset, currentMode)
        : [];

  return (
    <button
      type="button"
      key={theme.url}
      onClick={() => onSelect(theme)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(theme);
        }
      }}
      className={cn(
        "w-full cursor-pointer overflow-hidden rounded-lg border transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
        isSelected
          ? "border-primary ring-primary/20 shadow-sm ring-2"
          : "border-border hover:border-primary/50",
        "error" in theme &&
          theme.error &&
          "cursor-not-allowed opacity-50 hover:scale-100",
      )}
      disabled={"error" in theme && !!theme.error}
    >
      <div className="flex items-center justify-between p-3">
        <div className="text-left">
          <div className="text-sm font-medium">{theme.name}</div>
          {isSelected && (
            <div className="text-muted-foreground text-xs">
              Currently active
            </div>
          )}
        </div>
        {isSelected && (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            <CheckCircle className="text-primary size-4" />
          </div>
        )}
      </div>
      {colors.length > 0 && (
        <div className="flex h-2">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex-1"
              style={{
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      )}
      {"error" in theme && theme.error && (
        <div className="text-destructive p-3 pt-2 text-xs">
          Error: {theme.error}
        </div>
      )}
    </button>
  );
}

export { ThemeButton };
