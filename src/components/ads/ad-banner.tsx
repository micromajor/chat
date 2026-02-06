"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface AdBannerProps {
  slot: string;
  format?: "horizontal" | "vertical" | "rectangle";
  className?: string;
}

const formatStyles = {
  horizontal: "w-full h-[90px] md:h-[90px]", // 728x90 sur desktop
  vertical: "w-[160px] h-[600px]", // 160x600
  rectangle: "w-[300px] h-[250px]", // 300x250
};

/**
 * Composant pour afficher une publicité Google AdSense
 * En développement, affiche un placeholder
 */
export function AdBanner({ slot, format = "horizontal", className }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isProduction = process.env.NODE_ENV === "production";
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    // Ne charger les pubs qu'en production avec un ID AdSense configuré
    if (isProduction && adsenseId && adRef.current) {
      try {
        // @ts-expect-error - adsbygoogle est injecté par le script AdSense
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("Erreur de chargement AdSense:", error);
      }
    }
  }, [isProduction, adsenseId]);

  // En développement ou sans ID AdSense, afficher un placeholder
  if (!isProduction || !adsenseId) {
    return (
      <div
        className={cn(
          "bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600",
          "rounded-lg flex items-center justify-center",
          formatStyles[format],
          className
        )}
        aria-label="Emplacement publicitaire"
      >
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Publicité
        </span>
      </div>
    );
  }

  return (
    <div ref={adRef} className={cn(formatStyles[format], className)}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

/**
 * Publicité bannière horizontale (header/footer)
 * Ne s'affiche que si NEXT_PUBLIC_AD_SLOT_HEADER est configuré
 */
export function AdBannerHorizontal({ className }: { className?: string }) {
  const slot = process.env.NEXT_PUBLIC_AD_SLOT_HEADER;
  
  // Ne rien afficher si le slot n'est pas configuré (évite les iframes vides)
  if (!slot) return null;
  
  return (
    <AdBanner
      slot={slot}
      format="horizontal"
      className={className}
    />
  );
}

/**
 * Publicité carrée pour sidebar
 * Ne s'affiche que si NEXT_PUBLIC_AD_SLOT_SIDEBAR est configuré
 */
export function AdBannerSidebar({ className }: { className?: string }) {
  const slot = process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR;
  
  // Ne rien afficher si le slot n'est pas configuré (évite les iframes vides)
  if (!slot) return null;
  
  return (
    <AdBanner
      slot={slot}
      format="rectangle"
      className={className}
    />
  );
}

/**
 * Publicité native pour insertion dans les listes de profils
 * Ne s'affiche que si NEXT_PUBLIC_AD_SLOT_NATIVE est configuré
 */
export function AdBannerNative({ className }: { className?: string }) {
  const isProduction = process.env.NODE_ENV === "production";
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const slot = process.env.NEXT_PUBLIC_AD_SLOT_NATIVE;

  // Ne rien afficher si le slot n'est pas configuré (évite les iframes vides)
  if (!slot || !isProduction || !adsenseId) {
    return null;
  }

  return (
    <div className={cn("rounded-xl overflow-hidden", className)}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format="fluid"
      />
    </div>
  );
}
