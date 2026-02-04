import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne les classes Tailwind de manière intelligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calcule l'âge à partir d'une date de naissance
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Formate une date en texte relatif (il y a X minutes, etc.)
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "à l'instant";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `il y a ${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `il y a ${diffInDays}j`;
  }

  // Au-delà d'une semaine, afficher la date
  return then.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Tronque un texte à une longueur donnée
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Génère un ID unique
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

/**
 * Vérifie si un email est valide
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Vérifie si un mot de passe est assez fort
 * (min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre)
 */
export function isStrongPassword(password: string): boolean {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return minLength && hasUppercase && hasLowercase && hasNumber;
}

/**
 * Sanitize le texte pour éviter les injections XSS basiques
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Vérifie si l'utilisateur a 18 ans ou plus
 */
export function isAdult(birthDate: Date): boolean {
  return calculateAge(birthDate) >= 18;
}

/**
 * Retourne le statut en ligne formaté
 */
export function getOnlineStatus(
  isOnline: boolean,
  lastSeenAt: Date | string
): string {
  if (isOnline) {
    return "En ligne";
  }

  const lastSeen = new Date(lastSeenAt);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - lastSeen.getTime()) / 60000
  );

  if (diffInMinutes < 5) {
    return "En ligne récemment";
  }

  return `Vu ${formatRelativeTime(lastSeenAt)}`;
}
