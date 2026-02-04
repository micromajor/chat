"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  Lock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ParametresPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Vérifier le mode sombre actuel
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      )
    ) {
      return;
    }

    if (
      !confirm(
        "Toutes vos données seront définitivement supprimées. Confirmer ?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/profile", { method: "DELETE" });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
        Paramètres
      </h1>

      {/* Compte */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Compte
          </h2>
        </div>

        <Link
          href="/profil"
          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              Modifier mon profil
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link
          href="/parametres/mot-de-passe"
          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              Changer le mot de passe
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link
          href="/parametres/bloques"
          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              Utilisateurs bloqués
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
      </div>

      {/* Préférences */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Préférences
          </h2>
        </div>

        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-gray-500" />
            ) : (
              <Sun className="w-5 h-5 text-gray-500" />
            )}
            <span className="text-gray-700 dark:text-gray-300">
              Mode sombre
            </span>
          </div>
          <div
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              isDarkMode ? "bg-primary-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isDarkMode ? "translate-x-5" : ""
              }`}
            />
          </div>
        </button>

        <Link
          href="/parametres/notifications"
          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              Notifications
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
      </div>

      {/* Informations légales */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Informations légales
          </h2>
        </div>

        <Link
          href="/cgu"
          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <span className="text-gray-700 dark:text-gray-300">
            Conditions générales d'utilisation
          </span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link
          href="/confidentialite"
          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <span className="text-gray-700 dark:text-gray-300">
            Politique de confidentialité
          </span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link
          href="/mentions-legales"
          className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <span className="text-gray-700 dark:text-gray-300">
            Mentions légales
          </span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-2" />
          Se déconnecter
        </Button>

        <Button variant="danger" className="w-full" onClick={handleDeleteAccount}>
          <Trash2 className="w-5 h-5 mr-2" />
          Supprimer mon compte
        </Button>
      </div>

      {/* Version */}
      <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8">
        Menhir v1.0.0
      </p>
    </div>
  );
}
