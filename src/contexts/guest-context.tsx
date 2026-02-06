"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GuestContextType {
  isGuest: boolean;
  setGuestMode: (value: boolean) => void;
  showAuthPrompt: (action: string) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(false);
  const [authPrompt, setAuthPrompt] = useState<{ show: boolean; action: string }>({
    show: false,
    action: "",
  });

  useEffect(() => {
    // Vérifier si le mode invité est actif
    const guestMode = localStorage.getItem("guestMode");
    if (guestMode === "true") {
      setIsGuest(true);
    }
  }, []);

  const setGuestMode = (value: boolean) => {
    setIsGuest(value);
    if (value) {
      localStorage.setItem("guestMode", "true");
    } else {
      localStorage.removeItem("guestMode");
    }
  };

  const showAuthPrompt = (action: string) => {
    setAuthPrompt({ show: true, action });
  };

  return (
    <GuestContext.Provider value={{ isGuest, setGuestMode, showAuthPrompt }}>
      {children}
      {/* Modal d'incitation à l'inscription */}
      {authPrompt.show && (
        <AuthPromptModal
          action={authPrompt.action}
          onClose={() => setAuthPrompt({ show: false, action: "" })}
        />
      )}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error("useGuest must be used within a GuestProvider");
  }
  return context;
}

// Modal d'incitation à l'inscription
import Link from "next/link";
import { X, UserPlus, Lock, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

function AuthPromptModal({
  action,
  onClose,
}: {
  action: string;
  onClose: () => void;
}) {
  const actionMessages: Record<string, { title: string; description: string; icon: ReactNode }> = {
    message: {
      title: "Envoyez des messages",
      description: "Créez un compte gratuit pour discuter en privé avec ce profil.",
      icon: <MessageCircle className="w-8 h-8 text-primary-500" />,
    },
    like: {
      title: "Montre ton intérêt",
      description: "Inscris-toi gratuitement pour envoyer des likes et voir qui t'aime.",
      icon: <Heart className="w-8 h-8 text-pink-500" />,
    },
    view_full: {
      title: "Voir le profil complet",
      description: "Créez un compte pour accéder à tous les détails du profil.",
      icon: <Lock className="w-8 h-8 text-accent-500" />,
    },
    default: {
      title: "Rejoignez Menhir",
      description: "Inscris-toi gratuitement pour accéder à toutes les fonctionnalités.",
      icon: <UserPlus className="w-8 h-8 text-primary-500" />,
    },
  };

  const message = actionMessages[action] || actionMessages.default;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            {message.icon}
          </div>

          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            {message.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {message.description}
          </p>

          <div className="space-y-3">
            <Link href="/inscription" className="block">
              <Button variant="accent" className="w-full">
                <UserPlus className="w-5 h-5 mr-2" />
                Créer un compte gratuit
              </Button>
            </Link>

            <Link href="/connexion" className="block">
              <Button variant="outline" className="w-full">
                J'ai déjà un compte
              </Button>
            </Link>

            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Continuer en tant qu'invité
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
