"use client";

import { cn } from "@/lib/utils";

interface MenhirLogoProps {
  className?: string;
}

/**
 * Logo Menhir - Toujours en mode BD
 */
export function MenhirLogo({ className }: MenhirLogoProps) {
  return <MenhirLogoBDInline className={className} />;
}

/**
 * Logo Menhir BD inline - Pierre avec contour épais, fissures, mousse
 */
function MenhirLogoBDInline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6", className)}
    >
      {/* Ombre portée */}
      <ellipse cx="60" cy="152" rx="38" ry="6" fill="#1A1A1A" opacity="0.2" />

      {/* Pierre principale */}
      <path
        d="M52 148 L42 130 L36 100 L34 75 L36 50 L40 32 L46 18 L54 8 L62 5 L70 8 L78 18 L84 32 L88 50 L90 75 L88 100 L82 130 L72 148 Z"
        fill="#A8A29E"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Reflet clair */}
      <path
        d="M48 140 L42 120 L38 90 L37 65 L40 40 L46 22 L54 12 L58 10 L56 14 L48 26 L42 42 L39 65 L40 90 L44 120 L50 140 Z"
        fill="white"
        opacity="0.2"
      />

      {/* Zone sombre */}
      <path
        d="M72 148 L80 128 L86 100 L88 75 L86 52 L82 36 L76 22 L70 12 L68 10 L72 14 L78 24 L84 40 L87 60 L88 80 L85 105 L80 128 L74 145 Z"
        fill="#1A1A1A"
        opacity="0.12"
      />

      {/* Fissure principale */}
      <path
        d="M56 35 L54 45 L58 55 L55 68 L57 78 L54 88"
        stroke="#78716C"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Petite fissure */}
      <path
        d="M70 50 L68 58 L72 65"
        stroke="#78716C"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Mousse bas gauche */}
      <g fill="#4CAF50" stroke="#1A1A1A" strokeWidth="2">
        <circle cx="40" cy="142" r="4" />
        <circle cx="46" cy="140" r="3.5" />
        <circle cx="43" cy="137" r="3" />
      </g>

      {/* Mousse bas droite */}
      <g fill="#66BB6A" stroke="#1A1A1A" strokeWidth="2">
        <circle cx="78" cy="143" r="3.5" />
        <circle cx="73" cy="141" r="3" />
      </g>

      {/* Herbe */}
      <g stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 152 Q20 146 22 152" />
        <path d="M30 153 Q32 148 34 153" />
        <path d="M85 152 Q87 147 89 152" />
        <path d="M94 153 Q96 148 98 153" />
      </g>
    </svg>
  );
}
