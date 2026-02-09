"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/auth-context";
import { UnreadMessagesProvider } from "@/contexts/unread-messages-context";
import { ThemeStyleProvider } from "@/contexts/theme-style-context";
import { ComicBanner } from "@/components/ui/comic-banner";
import { ToastProvider } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <UnreadMessagesProvider>
          <ThemeStyleProvider>
            <ToastProvider>
              <ComicBanner />
              {children}
            </ToastProvider>
          </ThemeStyleProvider>
        </UnreadMessagesProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
