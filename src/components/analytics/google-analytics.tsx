"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Composant Google Analytics 4
 * RGPD : ne charge le tracking QU'APRÈS consentement explicite
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a accepté tous les cookies
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "all") {
      setHasConsent(true);
    }

    // Écouter les changements de consentement (en temps réel)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cookie-consent" && e.newValue === "all") {
        setHasConsent(true);
      }
    };

    // Écouter aussi un événement custom (même onglet)
    const handleConsent = () => {
      const consent = localStorage.getItem("cookie-consent");
      if (consent === "all") {
        setHasConsent(true);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("cookie-consent-updated", handleConsent);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cookie-consent-updated", handleConsent);
    };
  }, []);

  // Ne pas charger si pas d'ID configuré OU pas de consentement
  if (!GA_MEASUREMENT_ID || !hasConsent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
          });
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
    </>
  );
}

/**
 * Événements personnalisés pour le tracking
 */
export const analytics = {
  // Inscription réussie
  trackSignup: (method: "email" | "quick") => {
    if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
      // @ts-expect-error - gtag injecté par le script
      window.gtag?.("event", "sign_up", { method });
    }
  },

  // Connexion réussie
  trackLogin: (method: "email" | "quick") => {
    if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
      // @ts-expect-error - gtag injecté par le script
      window.gtag?.("event", "login", { method });
    }
  },

  // Message envoyé
  trackMessageSent: () => {
    if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
      // @ts-expect-error - gtag injecté par le script
      window.gtag?.("event", "message_sent", {
        event_category: "engagement",
      });
    }
  },

  // Like envoyé
  trackLikeSent: () => {
    if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
      // @ts-expect-error - gtag injecté par le script
      window.gtag?.("event", "like_sent", {
        event_category: "engagement",
      });
    }
  },

  // Profil consulté
  trackProfileView: () => {
    if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
      // @ts-expect-error - gtag injecté par le script
      window.gtag?.("event", "profile_view", {
        event_category: "engagement",
      });
    }
  },

  // Recherche effectuée
  trackSearch: (filters: string) => {
    if (typeof window !== "undefined" && GA_MEASUREMENT_ID) {
      // @ts-expect-error - gtag injecté par le script
      window.gtag?.("event", "search", {
        search_term: filters,
      });
    }
  },
};
