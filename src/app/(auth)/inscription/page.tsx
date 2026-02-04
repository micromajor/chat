"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  UserPlus,
  Mail,
  Lock,
  User,
  Calendar,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationSelect } from "@/components/ui/location-select";

export default function InscriptionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    pseudo: "",
    birthDate: "",
    country: "",
    department: "",
    acceptCGU: false,
    acceptPrivacy: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

      // Rediriger vers la page de confirmation
      router.push("/inscription/confirmation");
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors[field]?.[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-heading font-bold text-white">
              Menhir
            </span>
          </Link>
        </div>

        {/* Formulaire */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 overflow-visible">
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 text-center">
            Créer un compte
          </h1>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pseudo */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Pseudo"
                value={formData.pseudo}
                onChange={(e) =>
                  setFormData({ ...formData, pseudo: e.target.value })
                }
                className="pl-10"
                error={getFieldError("pseudo")}
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Adresse email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10"
                error={getFieldError("email")}
                required
              />
            </div>

            {/* Date de naissance */}
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                type="date"
                placeholder="Date de naissance"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                className="pl-10"
                error={getFieldError("birthDate")}
                max={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18)
                  )
                    .toISOString()
                    .split("T")[0]
                }
                required
              />
            </div>

            {/* Localisation */}
            <LocationSelect
              country={formData.country}
              department={formData.department}
              onCountryChange={(country) => setFormData(prev => ({ ...prev, country }))}
              onDepartmentChange={(department) => setFormData(prev => ({ ...prev, department }))}
              showLabels={false}
              required
              allowAllCountries={false}
            />
            {getFieldError("country") && (
              <p className="text-red-500 text-xs mt-1">{getFieldError("country")}</p>
            )}

            {/* Mot de passe */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
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

            {/* Confirmation mot de passe */}
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

            {/* Indications mot de passe */}
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

            {/* CGU */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={formData.acceptCGU}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptCGU: e.target.checked })
                  }
                  className="sr-only"
                  required
                />
                <div
                  className={`w-5 h-5 border-2 rounded ${
                    formData.acceptCGU
                      ? "bg-accent-500 border-accent-500"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {formData.acceptCGU && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                J'accepte les{" "}
                <Link href="/cgu" className="text-primary-500 hover:underline">
                  conditions générales d'utilisation
                </Link>
              </span>
            </label>

            {/* Politique de confidentialité */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={formData.acceptPrivacy}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptPrivacy: e.target.checked })
                  }
                  className="sr-only"
                  required
                />
                <div
                  className={`w-5 h-5 border-2 rounded ${
                    formData.acceptPrivacy
                      ? "bg-accent-500 border-accent-500"
                      : "border-gray-300"
                  } flex items-center justify-center`}
                >
                  {formData.acceptPrivacy && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                J'accepte la{" "}
                <Link
                  href="/confidentialite"
                  className="text-primary-500 hover:underline"
                >
                  politique de confidentialité
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full mt-6"
              isLoading={isLoading}
              disabled={!formData.acceptCGU || !formData.acceptPrivacy}
            >
              Créer mon compte
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Déjà un compte ?{" "}
            <Link
              href="/connexion"
              className="text-accent-500 hover:text-accent-600 font-medium"
            >
              Se connecter
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-primary-200 text-sm mt-6">
          Site réservé aux personnes majeures (18+)
        </p>
      </div>
    </div>
  );
}
