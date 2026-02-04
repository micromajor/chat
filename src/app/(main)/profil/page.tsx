"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Save,
  Camera,
  Trash2,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Profile {
  id: string;
  email: string;
  pseudo: string;
  avatar?: string;
  age: number;
  city?: string;
  region?: string;
  description?: string;
  searchAgeMin: number;
  searchAgeMax: number;
  searchDistance?: number;
  isInvisible: boolean;
  isVerified: boolean;
}

export default function MonProfilPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    pseudo: "",
    city: "",
    region: "",
    description: "",
    searchAgeMin: 18,
    searchAgeMax: 99,
    isInvisible: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();

        if (data.success) {
          setProfile(data.data);
          setFormData({
            pseudo: data.data.pseudo || "",
            city: data.data.city || "",
            region: data.data.region || "",
            description: data.data.description || "",
            searchAgeMin: data.data.searchAgeMin || 18,
            searchAgeMax: data.data.searchAgeMax || 99,
            isInvisible: data.data.isInvisible || false,
          });
        }
      } catch (error) {
        console.error("Erreur chargement profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Profil mis à jour !" });
        // Mettre à jour la session si le pseudo a changé
        if (formData.pseudo !== session?.user?.pseudo) {
          await update({ pseudo: formData.pseudo });
        }
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "Une erreur est survenue" });
    } finally {
      setIsSaving(false);
    }
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

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 animate-pulse">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-8"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6">
        Mon profil
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Avatar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar
                src={profile?.avatar}
                alt={profile?.pseudo || ""}
                size="xl"
                className="w-24 h-24"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600"
                title="Changer la photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {profile?.pseudo}
                {profile?.isVerified && (
                  <Shield className="w-4 h-4 text-green-500" />
                )}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile?.age} ans
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {profile?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Informations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Informations
          </h2>

          <div className="space-y-4">
            <Input
              label="Pseudo"
              value={formData.pseudo}
              onChange={(e) =>
                setFormData({ ...formData, pseudo: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ville"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Paris"
              />
              <Input
                label="Région"
                value={formData.region}
                onChange={(e) =>
                  setFormData({ ...formData, region: e.target.value })
                }
                placeholder="Île-de-France"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                maxLength={280}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Parlez de vous..."
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {formData.description.length}/280
              </p>
            </div>
          </div>
        </div>

        {/* Préférences de recherche */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Préférences de recherche
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Âge minimum"
                value={formData.searchAgeMin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    searchAgeMin: parseInt(e.target.value) || 18,
                  })
                }
                min={18}
                max={99}
              />
              <Input
                type="number"
                label="Âge maximum"
                value={formData.searchAgeMax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    searchAgeMax: parseInt(e.target.value) || 99,
                  })
                }
                min={18}
                max={99}
              />
            </div>
          </div>
        </div>

        {/* Confidentialité */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Confidentialité
          </h2>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              {formData.isInvisible ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Mode invisible
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Votre profil n'apparaîtra pas dans les recherches
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.isInvisible}
              onChange={(e) =>
                setFormData({ ...formData, isInvisible: e.target.checked })
              }
              className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="flex-1"
            isLoading={isSaving}
          >
            <Save className="w-5 h-5 mr-2" />
            Enregistrer
          </Button>
        </div>
      </form>

      {/* Zone dangereuse */}
      <div className="mt-8 p-6 border border-red-200 dark:border-red-900/50 rounded-2xl">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
          Zone dangereuse
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          La suppression de votre compte est irréversible. Toutes vos données
          seront définitivement effacées.
        </p>
        <Button variant="danger" onClick={handleDeleteAccount}>
          <Trash2 className="w-4 h-4 mr-2" />
          Supprimer mon compte
        </Button>
      </div>
    </div>
  );
}
