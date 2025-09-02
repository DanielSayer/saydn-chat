import { useThemeManagement } from "@/hooks/use-theme-management";
import {
  Loader2Icon,
  MoonIcon,
  PaintBucketIcon,
  Search,
  ShuffleIcon,
  SunIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  ResponsivePopover,
  ResponsivePopoverContent,
  ResponsivePopoverTrigger,
} from "../ui/responsive-popover";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ThemeButton } from "./theme-button";

function ThemeSwitcher() {
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
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-md"
          onClick={toggleMode}
        >
          <SunIcon className="h-3.5 w-3.5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <MoonIcon className="absolute h-3.5 w-3.5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle mode</span>
        </Button>

        <ResponsivePopover modal={false}>
          <ResponsivePopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="flex size-8 items-center rounded-md"
            >
              <PaintBucketIcon className="h-3.5 w-3.5" />
            </Button>
          </ResponsivePopoverTrigger>

          <ResponsivePopoverContent
            align="end"
            className="w-full p-0 md:w-80"
            title="Theme Selector"
            description="Choose a theme for your interface"
          >
            {/* Note: Title and description are already in ResponsivePopoverContent */}
            <Separator className="hidden md:block" />

            {/* Search Input */}
            <div className="hidden p-2 md:block">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search themes..."
                  className="bg-popover dark:bg-popover h-9 rounded-none border-none pl-10 shadow-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Separator />

            {/* Theme Count and Controls */}
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-muted-foreground text-sm">
                {isLoadingThemes
                  ? "Loading..."
                  : `${filteredThemes.length} themes`}
              </div>
              <div className="flex items-center gap-1">
                {/* Randomizer */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={randomizeTheme}
                  disabled={isLoadingThemes || filteredThemes.length === 0}
                  title="Random theme"
                >
                  <ShuffleIcon className="h-3.5 w-3.5" />
                  <span className="sr-only">Random theme</span>
                </Button>
              </div>
            </div>
            <Separator />

            {/* Themes List */}
            <ScrollArea className="h-80">
              <div className="p-3">
                {isLoadingThemes ? (
                  <div className="text-muted-foreground flex items-center justify-center gap-2 py-8">
                    <Loader2Icon className="size-4 animate-spin" />
                    Loading themes...
                  </div>
                ) : (
                  <div className="mt-1 grid grid-cols-1 gap-2">
                    {filteredThemes.map((theme) => (
                      <ThemeButton
                        key={theme.url}
                        theme={theme}
                        isSelected={selectedThemeUrl === theme.url}
                        onSelect={handleThemeSelect}
                        currentMode={themeState.currentMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </ResponsivePopoverContent>
        </ResponsivePopover>
      </div>
    </>
  );
}

export { ThemeSwitcher };
