"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/auth-context";
import { UnreadMessagesProvider } from "@/contexts/unread-messages-context";
import { ToastProvider } from "@/components/ui/toast";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Gestion du thème sombre
  useEffect(() => {
    // Vérifier les préférences stockées ou système
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <SessionProvider>
      <AuthProvider>
        <UnreadMessagesProvider>
          <ToastProvider>{children}</ToastProvider>
        </UnreadMessagesProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
