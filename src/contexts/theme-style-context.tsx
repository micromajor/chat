"use client";

import { createContext, useContext, type ReactNode } from "react";

type ThemeStyle = "comic";

interface ThemeStyleContextType {
  themeStyle: ThemeStyle;
  toggleThemeStyle: () => void;
  isComic: boolean;
}

const ThemeStyleContext = createContext<ThemeStyleContextType>({
  themeStyle: "comic",
  toggleThemeStyle: () => {},
  isComic: true,
});

export function useThemeStyle() {
  return useContext(ThemeStyleContext);
}

export function ThemeStyleProvider({ children }: { children: ReactNode }) {
  // Le thème BD est toujours actif — plus de toggle
  return (
    <ThemeStyleContext.Provider
      value={{
        themeStyle: "comic",
        toggleThemeStyle: () => {},
        isComic: true,
      }}
    >
      {children}
    </ThemeStyleContext.Provider>
  );
}
