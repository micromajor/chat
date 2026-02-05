"use client";

import Script from "next/script";

/**
 * Composant Google Analytics 4
 * Intègre le tracking GA4 avec consentement RGPD
 */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  // Ne pas charger si pas d'ID configuré
  if (!GA_MEASUREMENT_ID) return null;

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
