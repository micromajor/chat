"use client";

import { useState, useId } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { prepareImageForUpload } from "@/lib/image-compression";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onUploadComplete?: (base64Image: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean; // Pour bloquer l'upload aux comptes accès rapide
}

export function AvatarUpload({
  currentAvatar,
  onUploadComplete,
  onError,
  disabled = false,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const inputId = useId();

  // Si désactivé (accès rapide), afficher message
  if (disabled) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
            <Camera size={48} className="text-stone-400" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
            Les photos de profil sont réservées aux membres inscrits.
          </p>
          <a 
            href="/inscription" 
            className="text-sm text-primary-500 hover:text-primary-600 hover:underline font-medium"
          >
            Créer un compte →
          </a>
        </div>
      </div>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Préparer l'image (compression + validation)
      const compressedImage = await prepareImageForUpload(file);
      
      // Afficher l'aperçu
      setPreview(compressedImage);
      
      // Notifier le parent
      onUploadComplete?.(compressedImage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors du traitement de l'image";
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset input pour pouvoir re-sélectionner le même fichier
      e.target.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete?.("");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Aperçu de l'avatar */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera size={48} className="text-stone-400" />
          )}
        </div>
        
        {/* Bouton supprimer */}
        {preview && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-0 right-0 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
            aria-label="Supprimer la photo"
          >
            <X size={16} />
          </button>
        )}
        
        {/* Indicateur de chargement */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 size={32} className="text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Label cliquable avec input file caché à l'intérieur */}
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-center justify-center gap-2 px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 cursor-pointer",
          "border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500",
          isUploading && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="sr-only"
          disabled={isUploading}
        />
        {isUploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Traitement...</span>
          </>
        ) : (
          <>
            <Camera size={16} />
            <span>{preview ? "Changer la photo" : "Ajouter une photo"}</span>
          </>
        )}
      </label>

      {/* Informations */}
      <p className="text-xs text-stone-500 dark:text-stone-400 text-center max-w-xs">
        Format : JPG, PNG, GIF ou WebP<br />
        Taille max : 5 MB (sera compressée automatiquement)<br />
        La photo sera redimensionnée à 300x300 pixels
      </p>
    </div>
  );
}
