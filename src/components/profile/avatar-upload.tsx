"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prepareImageForUpload } from "@/lib/image-compression";

interface AvatarUploadProps {
  currentAvatar?: string | null;
  onUploadComplete?: (base64Image: string) => void;
  onError?: (error: string) => void;
}

export function AvatarUpload({
  currentAvatar,
  onUploadComplete,
  onError,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
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

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {/* Bouton de sélection */}
      <Button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        variant="outline"
        className="flex items-center space-x-2"
      >
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
      </Button>

      {/* Informations */}
      <p className="text-xs text-stone-500 dark:text-stone-400 text-center max-w-xs">
        Format : JPG, PNG, GIF ou WebP<br />
        Taille max : 5 MB (sera compressée automatiquement)<br />
        La photo sera redimensionnée à 300x300 pixels
      </p>
    </div>
  );
}
