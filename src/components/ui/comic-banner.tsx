"use client";

import { useThemeStyle } from "@/contexts/theme-style-context";

/**
 * Bandeau décoratif affiché en haut du site 
 * uniquement quand le thème BD est activé.
 */
export function ComicBanner() {
  const { isComic } = useThemeStyle();
  
  if (!isComic) return null;

  return (
    <div className="comic-banner" style={{
      background: "var(--comic-gold)",
      color: "var(--comic-ink)",
      textAlign: "center",
      padding: "5px 0",
      fontFamily: "var(--font-comic-heading)",
      fontSize: "0.8rem",
      letterSpacing: "3px",
      borderBottom: "2px solid var(--comic-ink)",
      textTransform: "uppercase",
      position: "relative",
      zIndex: 60,
    }}>
      💥 Le Menhir — Mode Bande Dessinée ! 💥
    </div>
  );
}
