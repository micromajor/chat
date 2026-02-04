"use client";

import { useAuth } from "@/contexts/auth-context";
import { useCallback } from "react";

/**
 * Hook pour effectuer des appels API authentifiés
 * Ajoute automatiquement le token d'accès rapide si présent
 */
export function useAuthenticatedFetch() {
  const { quickAccessToken } = useAuth();

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);

      // Ajouter le token d'accès rapide si présent
      if (quickAccessToken) {
        headers.set("X-Quick-Access-Token", quickAccessToken);
      }

      return fetch(url, {
        ...options,
        headers,
      });
    },
    [quickAccessToken]
  );

  return authenticatedFetch;
}

/**
 * Hook pour les requêtes GET authentifiées
 */
export function useAuthenticatedGet() {
  const fetchAuth = useAuthenticatedFetch();

  return useCallback(
    async <T>(url: string): Promise<{ success: boolean; data?: T; error?: string }> => {
      try {
        const response = await fetchAuth(url);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Erreur requête GET:", error);
        return { success: false, error: "Erreur réseau" };
      }
    },
    [fetchAuth]
  );
}

/**
 * Hook pour les requêtes POST authentifiées
 */
export function useAuthenticatedPost() {
  const fetchAuth = useAuthenticatedFetch();

  return useCallback(
    async <T>(url: string, body: unknown): Promise<{ success: boolean; data?: T; error?: string }> => {
      try {
        const response = await fetchAuth(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Erreur requête POST:", error);
        return { success: false, error: "Erreur réseau" };
      }
    },
    [fetchAuth]
  );
}
