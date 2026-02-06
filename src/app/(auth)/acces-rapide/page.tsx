"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Camera, Zap, X, Sparkles, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationSelect } from "@/components/ui/location-select";
import { generateRandomPseudo } from "@/lib/pseudo-generator";
import { MenhirLogo } from "@/components/ui/menhir-logo";

export default function AccesRapidePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Pseudo généré automatiquement au chargement
  const [pseudo, setPseudo] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  
  // Informations obligatoires
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [department, setDepartment] = useState("");

  // Si l'utilisateur est déjà connecté via NextAuth, le déconnecter
  useEffect(() => {
    if (status !== "loading" && session) {
      // L'utilisateur a une session NextAuth active, on le déconnecte
      signOut({ redirect: false }).then(() => {
        // Nettoyer le localStorage aussi
        localStorage.removeItem("quickAccessToken");
        localStorage.removeItem("quickAccessUser");
        // Recharger la page pour réinitialiser l'état
        window.location.reload();
      });
    }
  }, [session, status]);

  // Générer le pseudo automatiquement au montage du composant
  useEffect(() => {
    setPseudo(generateRandomPseudo());
  }, []);

  // Gestion de l'upload photo
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("La photo ne doit pas dépasser 5 Mo");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(file);
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setAvatar(null);
    setAvatarPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Création du profil rapide
  const handleCreateProfile = async () => {
    if (!pseudo) {
      setError("Erreur lors de la génération du pseudo");
      return;
    }
    
    if (!birthDate) {
      setError("La date de naissance est requise");
      return;
    }
    
    // Vérifier que l'utilisateur a au moins 18 ans
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    if (age < 18) {
      setError("Vous devez avoir au moins 18 ans");
      return;
    }
    
    if (!country) {
      setError("Le pays est requis");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("pseudo", pseudo);
      formDataToSend.append("isQuickAccess", "true");
      formDataToSend.append("birthDate", birthDate);
      formDataToSend.append("country", country);
      
      if (department) {
        formDataToSend.append("department", department);
      }
      
      if (avatar) {
        formDataToSend.append("avatar", avatar);
      }

      const res = await fetch("/api/auth/quick-register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        // Si le pseudo est déjà pris, en générer un nouveau et réessayer
        if (data.error?.includes("pseudo")) {
          setPseudo(generateRandomPseudo());
          throw new Error("Ce pseudo est déjà pris, un nouveau a été généré. Réessaie !");
        }
        throw new Error(data.error || "Erreur lors de la création");
      }

      // Stocker le token de session temporaire
      localStorage.setItem("quickAccessToken", data.token);
      localStorage.setItem("quickAccessUser", JSON.stringify(data.user));

      // Attendre un peu pour que le localStorage soit bien écrit
      await new Promise(resolve => setTimeout(resolve, 100));

      // Sur mobile, rediriger vers /messages pour voir la liste des utilisateurs
      // Sur desktop, rediriger vers /dashboard pour voir la recherche
      const isMobile = window.innerWidth < 768;
      window.location.href = isMobile ? "/messages" : "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };
  // Afficher un écran de chargement si on attend la déconnexion NextAuth
  if (status === "loading" || (status === "authenticated" && session)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Déconnexion en cours...</p>
          <p className="text-white/70 text-sm mt-2">Préparation de l'accès rapide</p>
        </div>
      </div>
    );
  }
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
              Menhir
            </span>
          </Link>
          <p className="text-white/80 mt-2 text-sm">Accès instantané ⚡</p>
        </div>

        {/* Formulaire simplifié */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
              Prêt à te connecter !
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Ton pseudo a été généré automatiquement
            </p>
          </div>

          {/* Pseudo attribué (non modifiable) */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ton pseudo
              </span>
            </div>
            <div className="text-2xl font-bold text-center text-primary-600 dark:text-primary-400">
              {pseudo || "Chargement..."}
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-2">
              Ce pseudo te sera attribué pour cette session
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Date de naissance */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date de naissance <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tu dois avoir au moins 18 ans
            </p>
          </div>

          {/* Localisation */}
          <div className="mb-6">
            <LocationSelect
              country={country}
              department={department}
              onCountryChange={setCountry}
              onDepartmentChange={setDepartment}
              required={true}
              showLabels={true}
              allowAllCountries={false}
            />
          </div>

          {/* Photo optionnelle */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
              Ajoute une photo <span className="text-gray-400">(optionnel)</span>
            </p>
            
            <div className="flex justify-center">
              {avatarPreview ? (
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-accent-200 dark:border-accent-800">
                    <img
                      src={avatarPreview}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center hover:border-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors">
                    <Camera className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">Ajouter</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Bouton de création */}
          <Button
            onClick={handleCreateProfile}
            variant="accent"
            size="lg"
            className="w-full"
            disabled={isLoading || !pseudo || !birthDate || !country}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Création en cours...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                C&apos;est parti !
              </>
            )}
          </Button>

          {/* Lien vers inscription complète */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Tu veux un compte permanent ?{" "}
            <Link
              href="/inscription"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Inscription complète
            </Link>
          </p>
        </div>

        {/* Mention légale */}
        <p className="text-center text-xs text-white/60 mt-6">
          En continuant, tu acceptes nos{" "}
          <Link href="/cgu" className="underline hover:text-white">
            CGU
          </Link>
        </p>
      </div>
    </div>
  );
}
