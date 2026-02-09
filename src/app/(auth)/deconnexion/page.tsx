"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenhirLogo } from "@/components/ui/menhir-logo";
import { useAuth } from "@/contexts/auth-context";

export default function DeconnexionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isQuickAccess = user?.isQuickAccess || false;

  const handleSignOut = async () => {
    try {
      // Appeler l'API logout pour mettre isOnline à false
      const token = localStorage.getItem("quickAccessToken");
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "X-Quick-Access-Token": token } : {}),
        },
      });
      
      // Pour les anonymes, supprimer le token local
      if (isQuickAccess) {
        localStorage.removeItem("quickAccessToken");
        localStorage.removeItem("quickAccessUser");
        router.push("/");
      } else {
        // Pour les inscrits, déconnexion NextAuth
        await signOut({ callbackUrl: "/" });
      }
    } catch (error) {
      console.error("Erreur déconnexion:", error);
      // En cas d'erreur, forcer la déconnexion quand même
      if (isQuickAccess) {
        localStorage.removeItem("quickAccessToken");
        localStorage.removeItem("quickAccessUser");
        router.push("/");
      } else {
        await signOut({ callbackUrl: "/" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-lg mb-4">
            <MenhirLogo className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Le Menhir
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <LogOut className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Déconnexion
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Êtes-vous sûr de vouloir vous déconnecter ?
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleSignOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
