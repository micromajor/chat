/**
 * Hook pour maintenir l'utilisateur "en ligne"
 * Envoie un heartbeat toutes les 2 minutes
 * Détecte la fermeture du navigateur pour déconnecter
 */

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

export function useOnlineStatus() {
  const { isAuthenticated, quickAccessToken } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const headers: HeadersInit = {};
    if (quickAccessToken) {
      headers["X-Quick-Access-Token"] = quickAccessToken;
    }

    // Fonction de heartbeat
    const sendHeartbeat = async () => {
      try {
        await fetch("/api/auth/heartbeat", {
          method: "POST",
          headers,
        });
      } catch (error) {
        console.error("Erreur heartbeat:", error);
      }
    };

    // Premier heartbeat immédiat
    sendHeartbeat();

    // Heartbeat toutes les 2 minutes
    const interval = setInterval(sendHeartbeat, 2 * 60 * 1000);

    // Détecter la fermeture du navigateur
    const handleBeforeUnload = () => {
      // Utiliser sendBeacon pour garantir l'envoi même si la page se ferme
      navigator.sendBeacon(
        "/api/auth/logout",
        new Blob([JSON.stringify({ token: quickAccessToken })], {
          type: "application/json",
        })
      );
    };

    // Détecter la visibilité de la page (onglet caché)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // L'utilisateur revient sur l'onglet, envoyer un heartbeat
        sendHeartbeat();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, quickAccessToken]);
}
