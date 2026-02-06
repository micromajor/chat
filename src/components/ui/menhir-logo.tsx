import { cn } from "@/lib/utils";

interface MenhirLogoProps {
  className?: string;
}

/**
 * Logo Menhir - Pierre dressée stylisée
 * Utilisé partout où l'icône Mountain était utilisée
 */
export function MenhirLogo({ className }: MenhirLogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6", className)}
    >
      {/* Pierre dressée (menhir) */}
      <path
        d="M12 2C10.5 2 9.5 3 9 4.5L8.5 8L8 14C7.8 16.5 9 20 10.5 21L11 21.5H13L13.5 21C15 20 16.2 16.5 16 14L15.5 8L15 4.5C14.5 3 13.5 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}
