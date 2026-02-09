"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/auth-context";
import { UnreadMessagesProvider } from "@/contexts/unread-messages-context";
import { ThemeStyleProvider } from "@/contexts/theme-style-context";
import { ThemeStyleSwitcher } from "@/components/ui/theme-style-switcher";
import { ComicBanner } from "@/components/ui/comic-banner";
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
          <ThemeStyleProvider>
            <ToastProvider>
              <ComicBanner />
              {children}
              <ThemeStyleSwitcher />
            </ToastProvider>
          </ThemeStyleProvider>
        </UnreadMessagesProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
