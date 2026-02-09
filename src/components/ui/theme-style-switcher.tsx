"use client";

import { useThemeStyle } from "@/contexts/theme-style-context";

/**
 * Bouton toggle pour basculer entre le thème normal et le thème BD.
 * Affiché en position fixe en bas à droite de l'écran.
 */
export function ThemeStyleSwitcher() {
  const { isComic, toggleThemeStyle } = useThemeStyle();

  return (
    <button
      onClick={toggleThemeStyle}
      className={`
        fixed bottom-20 md:bottom-6 right-4 z-[100]
        flex items-center gap-2 px-4 py-2.5
        rounded-full shadow-lg
        transition-all duration-300 
        hover:scale-105 active:scale-95
        ${isComic 
          ? "bg-stone-100 text-gray-800 border-2 border-gray-300 hover:bg-white" 
          : "bg-gradient-to-r from-blue-600 to-yellow-500 text-white border-2 border-black hover:from-blue-500 hover:to-yellow-400"
        }
      `}
      title={isComic ? "Revenir au thème normal" : "Activer le thème BD"}
      aria-label={isComic ? "Désactiver le thème bande dessinée" : "Activer le thème bande dessinée"}
    >
      {isComic ? (
        <>
          {/* Icône retour normal */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-sm font-medium hidden sm:inline">Thème Normal</span>
        </>
      ) : (
        <>
          {/* Icône BD / étoile */}
          <span className="text-lg">💥</span>
          <span className="text-sm font-bold hidden sm:inline" style={{ fontFamily: "'Bangers', cursive", letterSpacing: "1px" }}>
            Mode BD !
          </span>
          <span className="text-sm font-bold sm:hidden">BD</span>
        </>
      )}
    </button>
  );
}
