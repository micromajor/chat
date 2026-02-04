/**
 * Compression et optimisation des photos de profil
 * - 1 seule photo par profil
 * - Compression maximale (pour affichage en petit format uniquement)
 * - Stockage en base64 dans la base de données
 */

/**
 * Compresse une image en base64
 * @param base64Image - Image en format base64
 * @param maxWidth - Largeur maximale (défaut: 300px)
 * @param maxHeight - Hauteur maximale (défaut: 300px)
 * @param quality - Qualité de compression (0-1, défaut: 0.7)
 * @returns Image compressée en base64
 */
export async function compressImage(
  base64Image: string,
  maxWidth: number = 300,
  maxHeight: number = 300,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Créer une image depuis le base64
    const img = new Image();
    
    img.onload = () => {
      // Calculer les nouvelles dimensions en conservant le ratio
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      // Créer un canvas pour la compression
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Impossible de créer le contexte canvas"));
        return;
      }
      
      // Dessiner l'image redimensionnée
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convertir en base64 avec compression
      const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
      
      resolve(compressedBase64);
    };
    
    img.onerror = () => {
      reject(new Error("Erreur lors du chargement de l'image"));
    };
    
    // Charger l'image
    img.src = base64Image;
  });
}

/**
 * Valide qu'une image base64 ne dépasse pas la taille maximale
 * @param base64Image - Image en format base64
 * @param maxSizeKB - Taille maximale en KB (défaut: 100KB)
 * @returns true si l'image est valide
 */
export function validateImageSize(
  base64Image: string,
  maxSizeKB: number = 100
): boolean {
  // Calculer la taille en bytes
  const base64Length = base64Image.length;
  const padding = base64Image.endsWith("==") ? 2 : base64Image.endsWith("=") ? 1 : 0;
  const sizeInBytes = (base64Length * 3) / 4 - padding;
  const sizeInKB = sizeInBytes / 1024;
  
  return sizeInKB <= maxSizeKB;
}

/**
 * Valide qu'une image est au format base64 valide
 * @param base64Image - Image en format base64
 * @returns true si le format est valide
 */
export function validateBase64Format(base64Image: string): boolean {
  // Vérifier que c'est une image
  const imageRegex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
  return imageRegex.test(base64Image);
}

/**
 * Convertit un File en base64
 * @param file - Fichier image
 * @returns Promise avec l'image en base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Erreur lors de la lecture du fichier"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Erreur lors de la lecture du fichier"));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Prépare une image pour l'upload (compression + validation)
 * @param file - Fichier image
 * @returns Image compressée et validée en base64
 */
export async function prepareImageForUpload(file: File): Promise<string> {
  // Valider le type de fichier
  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier doit être une image");
  }
  
  // Valider la taille du fichier (max 5MB avant compression)
  const maxFileSizeMB = 5;
  if (file.size > maxFileSizeMB * 1024 * 1024) {
    throw new Error(`Le fichier ne doit pas dépasser ${maxFileSizeMB}MB`);
  }
  
  // Convertir en base64
  const base64 = await fileToBase64(file);
  
  // Valider le format
  if (!validateBase64Format(base64)) {
    throw new Error("Format d'image invalide");
  }
  
  // Compresser l'image
  const compressed = await compressImage(base64, 300, 300, 0.7);
  
  // Valider la taille après compression
  if (!validateImageSize(compressed, 100)) {
    // Si toujours trop grand, recompresser avec une qualité plus faible
    const recompressed = await compressImage(base64, 300, 300, 0.5);
    
    if (!validateImageSize(recompressed, 100)) {
      throw new Error("Impossible de compresser l'image suffisamment");
    }
    
    return recompressed;
  }
  
  return compressed;
}

/**
 * Extrait le type MIME d'une image base64
 * @param base64Image - Image en format base64
 * @returns Type MIME (ex: "image/jpeg")
 */
export function getMimeTypeFromBase64(base64Image: string): string | null {
  const match = base64Image.match(/^data:(image\/[a-z]+);base64,/);
  return match ? match[1] : null;
}
