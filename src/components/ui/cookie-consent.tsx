"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Bandeau de consentement cookies RGPD
 * Nécessaire pour Google Analytics et AdSense
 */
export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Délai pour ne pas bloquer le rendu initial
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setShowBanner(false);
    // Déclencher le chargement de Google Analytics
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cookie-consent-updated"));
    }
  };

  const acceptEssential = () => {
    localStorage.setItem("cookie-consent", "essential");
    setShowBanner(false);
    // Rien à faire : GA ne se chargera pas du tout
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-stone-900/95 backdrop-blur-md border-t border-stone-700 shadow-2xl animate-slide-up">
      <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 text-sm text-stone-300">
          <p className="font-semibold text-white mb-1">🍪 Cookies & Vie privée</p>
          <p>
            Menhir utilise des cookies pour améliorer ton expérience, analyser le trafic
            et afficher des publicités pertinentes.{" "}
            <a href="/confidentialite" className="text-red-400 hover:text-red-300 underline">
              En savoir plus
            </a>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={acceptEssential}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              "bg-stone-700 text-stone-300 hover:bg-stone-600 hover:text-white"
            )}
          >
            Essentiels uniquement
          </button>
          <button
            onClick={acceptAll}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              "bg-red-600 text-white hover:bg-red-500 shadow-lg"
            )}
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}
