// Context pour gérer le compteur de messages non lus
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./auth-context";

interface UnreadMessagesContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  incrementUnreadCount: () => void;
  decrementUnreadCount: (count?: number) => void;
  resetUnreadCount: () => void;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export function UnreadMessagesProvider({ children }: { children: ReactNode }) {
  const { user, quickAccessToken } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    try {
      const headers: HeadersInit = {};
      if (quickAccessToken) {
        headers["X-Quick-Access-Token"] = quickAccessToken;
      }

      const response = await fetch("/api/messages/unread", { headers });
      const data = await response.json();

      if (data.success) {
        setUnreadCount(data.data.unreadCount);
      }
    } catch (error) {
      console.error("Erreur récupération messages non lus:", error);
    }
  };

  const refreshUnreadCount = async () => {
    await fetchUnreadCount();
  };

  const incrementUnreadCount = () => {
    setUnreadCount((prev) => prev + 1);
  };

  const decrementUnreadCount = (count = 1) => {
    setUnreadCount((prev) => Math.max(0, prev - count));
  };

  const resetUnreadCount = () => {
    setUnreadCount(0);
  };

  // Fetch initial et polling toutes les 10 secondes
  useEffect(() => {
    if (!user) return;

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);

    return () => clearInterval(interval);
  }, [user, quickAccessToken]);

  return (
    <UnreadMessagesContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        incrementUnreadCount,
        decrementUnreadCount,
        resetUnreadCount,
      }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
}

export function useUnreadMessages() {
  const context = useContext(UnreadMessagesContext);
  if (context === undefined) {
    throw new Error("useUnreadMessages must be used within UnreadMessagesProvider");
  }
  return context;
}
