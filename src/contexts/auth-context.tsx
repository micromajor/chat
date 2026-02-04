"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface AuthUser {
  id: string;
  pseudo: string;
  avatar?: string | null;
  isQuickAccess: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  quickAccessToken: string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  quickAccessToken: null,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [quickAccessUser, setQuickAccessUser] = useState<AuthUser | null>(null);
  const [quickAccessToken, setQuickAccessToken] = useState<string | null>(null);
  const [isLoadingQuickAccess, setIsLoadingQuickAccess] = useState(true);

  // Charger le token d'accès rapide depuis localStorage
  useEffect(() => {
    const token = localStorage.getItem("quickAccessToken");
    const storedUser = localStorage.getItem("quickAccessUser");

    if (token && storedUser) {
      setQuickAccessToken(token);
      try {
        const userData = JSON.parse(storedUser);
        setQuickAccessUser({
          id: userData.id,
          pseudo: userData.pseudo,
          avatar: userData.avatar,
          isQuickAccess: true,
        });
      } catch {
        // Données corrompues, nettoyer
        localStorage.removeItem("quickAccessToken");
        localStorage.removeItem("quickAccessUser");
      }
    }
    setIsLoadingQuickAccess(false);
  }, []);

  // Déconnexion
  const logout = async () => {
    // Appeler l'API de déconnexion pour gérer la suppression des messages
    try {
      const headers: HeadersInit = {};
      if (quickAccessToken) {
        headers["X-Quick-Access-Token"] = quickAccessToken;
      }
      
      await fetch("/api/auth/logout", {
        method: "POST",
        headers,
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
    
    // Nettoyer le localStorage
    localStorage.removeItem("quickAccessToken");
    localStorage.removeItem("quickAccessUser");
    setQuickAccessToken(null);
    setQuickAccessUser(null);
    
    // Si session NextAuth, rediriger vers signout
    if (session) {
      window.location.href = "/api/auth/signout";
    } else {
      window.location.href = "/";
    }
  };

  // Déterminer l'utilisateur actuel (priorité à NextAuth)
  const currentUser: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        pseudo: session.user.pseudo || "Utilisateur",
        avatar: session.user.avatar,
        isQuickAccess: false,
      }
    : quickAccessUser;

  const isLoading = status === "loading" || isLoadingQuickAccess;
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated,
        isLoading,
        quickAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
