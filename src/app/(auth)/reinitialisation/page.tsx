"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ReinitialisationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setErrors({});

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          setErrors(data.details);
        } else {
          setError(data.error || "Une erreur est survenue");
        }
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/connexion");
      }, 3000);
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors[field]?.[0];
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Lien invalide
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ce lien de réinitialisation est invalide ou a expiré.
            </p>
            <Link
              href="/mot-de-passe-oublie"
              className="text-accent-500 hover:text-accent-600 font-medium"
            >
              Faire une nouvelle demande
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Mot de passe réinitialisé !
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ton mot de passe a été modifié avec succès.
            </p>
            <p className="text-sm text-gray-500">
              Redirection automatique vers la connexion...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2 text-center">
            Nouveau mot de passe
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Entrez votre nouveau mot de passe.
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pl-10 pr-10"
                error={getFieldError("password")}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="pl-10"
                error={getFieldError("confirmPassword")}
                required
              />
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>Le mot de passe doit contenir :</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li
                  className={
                    formData.password.length >= 8 ? "text-green-500" : ""
                  }
                >
                  Au moins 8 caractères
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.password) ? "text-green-500" : ""
                  }
                >
                  Une majuscule
                </li>
                <li
                  className={
                    /[a-z]/.test(formData.password) ? "text-green-500" : ""
                  }
                >
                  Une minuscule
                </li>
                <li
                  className={
                    /[0-9]/.test(formData.password) ? "text-green-500" : ""
                  }
                >
                  Un chiffre
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full mt-6"
              isLoading={isLoading}
            >
              Réinitialiser le mot de passe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ReinitialisationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      }
    >
      <ReinitialisationContent />
    </Suspense>
  );
}
