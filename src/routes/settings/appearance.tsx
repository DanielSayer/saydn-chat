import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useThemeManagement } from "@/hooks/use-theme-management";
import { type FetchedTheme, extractThemeColors } from "@/lib/theme-utils";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle,
  Eye,
  MoonIcon,
  Search,
  ShuffleIcon,
  SunIcon,
} from "lucide-react";

type ThemeCardProps = {
  theme: FetchedTheme;
  isSelected: boolean;
  onSelect: (theme: FetchedTheme) => void;
  currentMode: "light" | "dark";
};

export const Route = createFileRoute("/settings/appearance")({
  component: AppearanceSettings,
});

const ThemeCard = ({
  theme,
  isSelected,
  onSelect,
  currentMode,
}: ThemeCardProps) => {
  const colors =
    "error" in theme && theme.error
      ? []
      : "preset" in theme
        ? extractThemeColors(theme.preset, currentMode)
        : [];

  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-0",
        isSelected
          ? "bg-primary/5 ring-primary/20 ring-1"
          : "hover:ring-border hover:ring-1",
        "error" in theme && theme.error && "cursor-not-allowed opacity-50",
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between p-4 pb-0 text-left"
        onClick={() => !("error" in theme && theme.error) && onSelect(theme)}
        disabled={"error" in theme && !!theme.error}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h4 className="text-foreground truncate text-sm font-medium">
              {theme.name}
            </h4>
            {isSelected && (
              <CheckCircle className="text-primary size-4 flex-shrink-0" />
            )}
          </div>

          {colors.length > 0 && (
            <div className="bg-background/50 -mx-4 flex h-3 overflow-hidden rounded-sm">
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
            <div className="text-destructive mt-2 text-xs font-medium">
              Error: {theme.error}
            </div>
          )}
        </div>
      </button>
    </Card>
  );
};

function AppearanceSettings() {
  const {
    themeState,
    searchQuery,
    setSearchQuery,
    selectedThemeUrl,
    isLoadingThemes,
    filteredThemes,
    handleThemeSelect,
    toggleMode,
    randomizeTheme,
  } = useThemeManagement();

  return (
    <div className="space-y-8">
      {/* Display Mode Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-foreground font-semibold">Display Mode</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Choose between light and dark mode
          </p>
        </div>

        <div className="grid max-w-xl grid-cols-2 gap-3">
          <Card
            className={cn(
              "bg-muted/20 hover:bg-muted/40 cursor-pointer border-0 p-4 transition-all duration-200",
              themeState.currentMode === "light"
                ? "bg-primary/5 ring-primary/20 ring-1"
                : "hover:ring-border hover:ring-1",
            )}
            onClick={() => themeState.currentMode === "dark" && toggleMode()}
          >
            <div className="flex items-center gap-3">
              <div className="bg-background flex size-8 items-center justify-center rounded-full">
                <SunIcon className="text-foreground h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label className="text-foreground cursor-pointer font-medium">
                    Light
                  </Label>
                  {themeState.currentMode === "light" && (
                    <CheckCircle className="text-primary ml-auto size-4" />
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card
            className={cn(
              "bg-muted/20 hover:bg-muted/40 cursor-pointer border-0 p-4 transition-all duration-200",
              themeState.currentMode === "dark"
                ? "bg-primary/5 ring-primary/20 ring-1"
                : "hover:ring-border hover:ring-1",
            )}
            onClick={() => themeState.currentMode === "light" && toggleMode()}
          >
            <div className="flex items-center gap-3">
              <div className="bg-background flex size-8 items-center justify-center rounded-full">
                <MoonIcon className="text-foreground h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label className="text-foreground cursor-pointer font-medium">
                    Dark
                  </Label>
                  {themeState.currentMode === "dark" && (
                    <CheckCircle className="text-primary ml-auto size-4" />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Themes Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-foreground font-semibold">Themes</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Select and manage your color themes
          </p>
        </div>

        {/* Theme Controls */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search themes..."
                className="bg-muted/20 focus:bg-background pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={randomizeTheme}
            disabled={isLoadingThemes || filteredThemes.length === 0}
            title="Random theme"
          >
            <ShuffleIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Theme Content */}
        {isLoadingThemes ? (
          <div className="text-muted-foreground flex items-center justify-center gap-2 py-12">
            <div className="border-muted-foreground size-4 animate-spin rounded-full border-2 border-t-transparent" />
            Loading themes...
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-3">
              <h4 className="text-muted-foreground text-sm font-medium">
                Built-in Themes ({filteredThemes.length})
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredThemes.map((theme) => (
                  <ThemeCard
                    key={theme.url}
                    theme={theme}
                    isSelected={selectedThemeUrl === theme.url}
                    onSelect={handleThemeSelect}
                    currentMode={themeState.currentMode}
                  />
                ))}
              </div>
            </div>

            {filteredThemes.length === 0 && searchQuery && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Eye className="text-muted-foreground mb-3 h-8 w-8" />
                <h4 className="text-foreground font-medium">No themes found</h4>
                <p className="text-muted-foreground mt-1 text-sm">
                  Try adjusting your search query
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
