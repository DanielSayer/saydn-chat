import { useThemeStore } from "@/lib/theme-store";
import {
  type FetchedTheme,
  THEME_URLS,
  type ThemePreset,
  fetchThemeFromUrl,
} from "@/lib/theme-utils";
import { toggleThemeMode } from "@/lib/toggle-theme-mode";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useThemeManagement() {
  const { themeState, setThemeState } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThemeUrl, setSelectedThemeUrl] = useState<string | null>(null);

  const { data: fetchedThemes = [], isLoading: isLoadingThemes } = useQuery({
    queryKey: ["themes", THEME_URLS],
    queryFn: () => Promise.all(THEME_URLS.map(fetchThemeFromUrl)),
    enabled: THEME_URLS.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const applyThemePreset = (preset: ThemePreset) => {
    setThemeState({
      currentMode: themeState.currentMode,
      cssVars: preset.cssVars,
    });
  };

  const handleThemeSelect = (theme: FetchedTheme) => {
    if ("error" in theme && theme.error) {
      return;
    }

    if ("preset" in theme) {
      applyThemePreset(theme.preset);
      setSelectedThemeUrl(theme.url);
    }
  };

  const toggleMode = () => {
    toggleThemeMode();
  };

  const randomizeTheme = () => {
    const availableThemes = fetchedThemes.filter(
      (theme) => !("error" in theme && theme.error),
    );
    if (availableThemes.length > 0) {
      const randomTheme =
        availableThemes[Math.floor(Math.random() * availableThemes.length)];
      handleThemeSelect(randomTheme);
    }
  };

  const filteredThemes = fetchedThemes.filter((theme) =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    themeState,
    searchQuery,
    setSearchQuery,
    selectedThemeUrl,
    setSelectedThemeUrl,
    isLoadingThemes,
    fetchedThemes,
    filteredThemes,

    handleThemeSelect,
    toggleMode,
    randomizeTheme,
    applyThemePreset,
  };
}
