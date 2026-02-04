/**
 * Générateur de pseudos aléatoires pour Menhir
 * Format: Menhir_XXXXX (où X est un chiffre)
 */

/**
 * Génère un pseudo aléatoire unique au format Menhir_ID
 */
export function generateRandomPseudo(): string {
  const id = Math.floor(Math.random() * 99999) + 1;
  return `Menhir_${id.toString().padStart(5, '0')}`;
}

/**
 * Génère un pseudo pour un visiteur anonyme
 */
export function generateGuestPseudo(): string {
  const id = Math.floor(Math.random() * 99999) + 1;
  return `Menhir_${id.toString().padStart(5, '0')}`;
}

/**
 * Liste de pseudos suggérés pour l'inscription
 */
export function getSuggestedPseudos(count: number = 3): string[] {
  const pseudos: string[] = [];
  
  for (let i = 0; i < count; i++) {
    pseudos.push(generateRandomPseudo());
  }
  
  return pseudos;
}
