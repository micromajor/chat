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
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useToast } from "@/components/ui/toast";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useAuthenticatedFetch } from "@/hooks/use-authenticated-fetch";

export default function ParametresPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { user, logout } = useAuth();
  const authenticatedFetch = useAuthenticatedFetch();
  const { addToast } = useToast();
  
  const isQuickAccess = user?.isQuickAccess ?? false;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    // Vérifier le mode sombre actuel
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      addToast("info", "Mode clair activé");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      addToast("info", "Mode sombre activé");
    }
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      if (isQuickAccess) {
        logout();
      } else {
        await signOut({ redirect: false });
      }
      addToast("success", "Déconnexion réussie");
      router.push("/");
    } catch (error) {
      console.error("Erreur déconnexion:", error);
      addToast("error", "Erreur lors de la déconnexion");
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    
    try {
      const response = await authenticatedFetch("/api/account", { 
        method: "DELETE" 
      });

      if (response.ok) {
        addToast("success", "Ton compte a été supprimé");
        // Attendre un peu pour que le toast s'affiche
        setTimeout(() => {
          if (isQuickAccess) {
            logout();
          } else {
            signOut({ callbackUrl: "/" });
          }
        }, 1000);
      } else {
        const data = await response.json();
        addToast("error", data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      addToast("error", "Une erreur est survenue");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
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
        <Button variant="outline" className="w-full" onClick={() => setShowLogoutModal(true)}>
          <LogOut className="w-5 h-5 mr-2" />
          Se déconnecter
        </Button>

        <Button 
          variant="danger" 
          className="w-full" 
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Supprimer mon compte
        </Button>
      </div>

      {/* Version */}
      <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-8">
        Menhir v1.0.0
      </p>

      {/* Modal de confirmation de déconnexion */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Se déconnecter ?"
        message="Tu es sur le point de te déconnecter de Menhir."
        confirmText="Se déconnecter"
        cancelText="Annuler"
        variant="default"
        loading={logoutLoading}
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Supprimer ton compte ?"
        message="Cette action est irréversible. Toutes tes données, messages et conversations seront définitivement supprimés."
        confirmText="Supprimer définitivement"
        cancelText="Annuler"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
