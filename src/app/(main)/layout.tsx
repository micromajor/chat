"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MainLayout } from "@/components/layout/main-layout";
import { useAuth } from "@/contexts/auth-context";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { status } = useSession();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Attendre que l'authentification soit vérifiée
    if (status !== "loading" && !isLoading) {
      if (!isAuthenticated) {
        // Pas d'utilisateur connecté (ni NextAuth, ni QuickAccess)
        router.push("/");
      } else {
        setChecked(true);
      }
    }
  }, [status, isLoading, isAuthenticated, router]);

  // Écran de chargement pendant la vérification
  if (isLoading || status === "loading" || !checked) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}
