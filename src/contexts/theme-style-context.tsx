"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type ThemeStyle = "default" | "comic";

interface ThemeStyleContextType {
  themeStyle: ThemeStyle;
  toggleThemeStyle: () => void;
  isComic: boolean;
}

const ThemeStyleContext = createContext<ThemeStyleContextType>({
  themeStyle: "default",
  toggleThemeStyle: () => {},
  isComic: false,
});

export function useThemeStyle() {
  return useContext(ThemeStyleContext);
}

export function ThemeStyleProvider({ children }: { children: ReactNode }) {
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>("default");

  // Charger le thème depuis localStorage au montage
  useEffect(() => {
    const saved = localStorage.getItem("menhir-theme-style") as ThemeStyle;
    if (saved === "comic") {
      setThemeStyle("comic");
      document.documentElement.classList.add("comic-theme");
    }
  }, []);

  const toggleThemeStyle = useCallback(() => {
    setThemeStyle((prev) => {
      const next = prev === "default" ? "comic" : "default";
      localStorage.setItem("menhir-theme-style", next);
      
      if (next === "comic") {
        document.documentElement.classList.add("comic-theme");
      } else {
        document.documentElement.classList.remove("comic-theme");
      }
      
      return next;
    });
  }, []);

  return (
    <ThemeStyleContext.Provider
      value={{
        themeStyle,
        toggleThemeStyle,
        isComic: themeStyle === "comic",
      }}
    >
      {children}
    </ThemeStyleContext.Provider>
  );
}
