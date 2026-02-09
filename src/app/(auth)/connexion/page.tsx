"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, LogIn, User, Lock, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenhirLogo } from "@/components/ui/menhir-logo";

// Fonction pour nettoyer les cookies de session corrompus/trop gros
function cleanupSessionCookies() {
  const cookiesToClean = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.csrf-token',
    '__Secure-next-auth.csrf-token',
    'next-auth.callback-url',
    '__Secure-next-auth.callback-url',
  ];
  
  // Chercher aussi les cookies chunked (session splitée)
  const allCookies = document.cookie.split(';');
  allCookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();
    if (cookieName.includes('next-auth') && cookieName.includes('.')) {
      cookiesToClean.push(cookieName);
    }
  });
  
  // Supprimer chaque cookie avec les différents paths possibles
  cookiesToClean.forEach(name => {
    // Path racine
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    // Avec domain
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
  });
}

export default function ConnexionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Nettoyer les cookies corrompus au chargement de la page
  useEffect(() => {
    cleanupSessionCookies();
  }, []);
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [formData, setFormData] = useState({
    pseudo: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setNeedsVerification(false);
    setResendSuccess(false);

    try {
      const result = await signIn("credentials", {
        pseudo: formData.pseudo.trim(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "EMAIL_NON_VERIFIE") {
          setNeedsVerification(true);
          setError("Tu dois vérifier ton email avant de te connecter.");
        } else {
          setError(result.error);
        }
      } else {
        // Sur mobile, rediriger vers /messages pour voir la liste des utilisateurs
        const isMobile = window.innerWidth < 768;
        router.push(isMobile ? "/messages" : "/dashboard");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setError("");
    setResendSuccess(false);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo: formData.pseudo }),
      });

      const data = await res.json();

      if (res.ok) {
        setResendSuccess(true);
      } else {
        setError(data.error || "Erreur lors de l'envoi");
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <MenhirLogo className="w-8 h-8 text-white" />
            </div>
            <span className="text-4xl font-heading font-bold text-white drop-shadow-lg">
              Le Menhir
            </span>
          </Link>
        </div>

        {/* Formulaire */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 text-center">
            Content de te revoir ! 👋
          </h1>

          {error && (
            <div className={`p-4 rounded-xl mb-6 text-sm ${
              needsVerification 
                ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
            }`}>
              <div className="flex items-start gap-2">
                {needsVerification && <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                <div className="flex-1">
                  <p>{error}</p>
                  {needsVerification && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResendEmail}
                      disabled={isResending}
                      className="mt-3 border-amber-500 text-amber-700 hover:bg-amber-100 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-900/30"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Renvoyer l'email de vérification
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {resendSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-xl mb-6 text-sm">
              ✅ Email de vérification renvoyé ! Vérifie ta boîte mail.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ton pseudo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Entre ton pseudo"
                  value={formData.pseudo}
                  onChange={(e) =>
                    setFormData({ ...formData, pseudo: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ton mot de passe"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link
                href="/mot-de-passe-oublie"
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              🔥 Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Pas encore membre ?{" "}
            <Link
              href="/inscription"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Rejoins-nous !
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          Site réservé aux personnes majeures (18+)
        </p>
      </div>
    </div>
  );
}
