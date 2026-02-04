# 📸 Gestion des Photos de Profil - Menhir

## 🎯 Spécifications

- **1 photo maximum** par utilisateur
- **Compression automatique** avant stockage
- **Stockage en base64** dans PostgreSQL (champ `avatar` de type `TEXT`)
- **Dimensions**: 300x300 pixels maximum
- **Taille finale**: ~100KB maximum après compression
- **Formats acceptés**: JPG, PNG, GIF, WebP

## 🛠️ Implémentation

### 1. Composant d'Upload

Utilisez le composant [`AvatarUpload`](src/components/profile/avatar-upload.tsx) :

```tsx
import { AvatarUpload } from "@/components/profile/avatar-upload";

<AvatarUpload
  currentAvatar={user.avatar}
  onUploadComplete={(base64) => {
    // Mettre à jour le profil avec la nouvelle image
    updateProfile({ avatar: base64 });
  }}
  onError={(error) => {
    console.error(error);
  }}
/>
```

### 2. Fonctions de Compression

Le fichier [`image-compression.ts`](src/lib/image-compression.ts) fournit :

- `prepareImageForUpload(file)` - Compresse et valide une image
- `compressImage(base64, width, height, quality)` - Compresse une image base64
- `validateImageSize(base64, maxSizeKB)` - Vérifie la taille
- `fileToBase64(file)` - Convertit un File en base64

### 3. Processus de Compression

1. **Upload fichier** (max 5MB avant compression)
2. **Conversion** en base64
3. **Redimensionnement** à 300x300px (ratio préservé)
4. **Compression JPEG** à qualité 70%
5. **Validation** taille finale < 100KB
6. **Si trop grand**, recompression à qualité 50%
7. **Stockage** dans PostgreSQL

## 📊 Avantages de cette Approche

✅ **Pas de service externe** (pas de Cloudinary, S3, etc.)
✅ **Pas de frais** supplémentaires
✅ **Simplicité** de déploiement
✅ **Backup automatique** avec la DB
✅ **Performances** acceptables pour de petites images

## ⚠️ Limitations

- Ne convient pas pour de grandes images
- Augmente légèrement la taille de la DB
- Pas de CDN (mais acceptable pour ce use case)

## 🔧 Exemple d'Utilisation dans une Page

```tsx
"use client";

import { useState } from "react";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { Button } from "@/components/ui/button";

export default function ProfileEditPage() {
  const [avatar, setAvatar] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar }),
      });

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");

      alert("Photo de profil mise à jour !");
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ma photo de profil</h1>
      
      <AvatarUpload
        currentAvatar={avatar}
        onUploadComplete={setAvatar}
        onError={(error) => alert(error)}
      />

      <Button
        onClick={handleSave}
        disabled={isLoading || !avatar}
        className="w-full mt-6"
      >
        {isLoading ? "Sauvegarde..." : "Enregistrer"}
      </Button>
    </div>
  );
}
```

## 🎨 Affichage de l'Avatar

Pour afficher l'avatar partout dans l'app :

```tsx
import { Avatar } from "@/components/ui/avatar";

<Avatar>
  {user.avatar ? (
    <img
      src={user.avatar}
      alt={`Photo de ${user.pseudo}`}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full bg-stone-300 flex items-center justify-center">
      {user.pseudo.charAt(0).toUpperCase()}
    </div>
  )}
</Avatar>
```

## 🔐 Sécurité

- ✅ Validation du type MIME côté client
- ✅ Validation de la taille avant et après compression
- ✅ Pas d'exécution de code (base64 = données uniquement)
- ✅ Rate limiting recommandé sur l'API d'upload

## 📈 Métriques

Avec cette configuration :
- Photo originale : ~2-5 MB
- Photo compressée : ~50-100 KB
- **Réduction : ~98%**
- Taille en DB : ~70-140 KB (base64 encode overhead)
