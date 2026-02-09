"use client";

import { cn } from "@/lib/utils";

interface MenhirLogoBDProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
}

/**
 * Logo Menhir style Bande Dessinée
 * Pierre dressée avec contour épais, fissures, mousse et ombre portée
 */
export function MenhirLogoBD({ className, size = "md" }: MenhirLogoBDProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
    hero: "w-40 h-40",
  };

  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizes[size], className)}
    >
      {/* Ombre portée au sol */}
      <ellipse
        cx="60"
        cy="152"
        rx="38"
        ry="6"
        fill="#1A1A1A"
        opacity="0.2"
      />

      {/* Pierre principale - forme irrégulière de menhir */}
      <path
        d="M52 148 L42 130 L36 100 L34 75 L36 50 L40 32 L46 18 L54 8 L62 5 L70 8 L78 18 L84 32 L88 50 L90 75 L88 100 L82 130 L72 148 Z"
        fill="#A8A29E"
        stroke="#1A1A1A"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Reflet clair (côté gauche) */}
      <path
        d="M48 140 L42 120 L38 90 L37 65 L40 40 L46 22 L54 12 L58 10 L56 14 L48 26 L42 42 L39 65 L40 90 L44 120 L50 140 Z"
        fill="white"
        opacity="0.2"
      />

      {/* Zone sombre (côté droit) */}
      <path
        d="M72 148 L80 128 L86 100 L88 75 L86 52 L82 36 L76 22 L70 12 L68 10 L72 14 L78 24 L84 40 L87 60 L88 80 L85 105 L80 128 L74 145 Z"
        fill="#1A1A1A"
        opacity="0.12"
      />

      {/* Fissure principale */}
      <path
        d="M56 35 L54 45 L58 55 L55 68 L57 78 L54 88"
        stroke="#78716C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Petite fissure */}
      <path
        d="M70 50 L68 58 L72 65"
        stroke="#78716C"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Petite fissure secondaire */}
      <path
        d="M62 90 L60 98 L63 105"
        stroke="#78716C"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Hachures de texture (style BD) */}
      <g stroke="#78716C" strokeWidth="1" opacity="0.3">
        <line x1="44" y1="60" x2="48" y2="62" />
        <line x1="45" y1="70" x2="49" y2="72" />
        <line x1="46" y1="80" x2="50" y2="82" />
        <line x1="44" y1="95" x2="48" y2="97" />
        <line x1="46" y1="110" x2="50" y2="112" />
        <line x1="72" y1="55" x2="76" y2="57" />
        <line x1="74" y1="70" x2="78" y2="72" />
        <line x1="75" y1="85" x2="79" y2="87" />
        <line x1="73" y1="100" x2="77" y2="102" />
        <line x1="72" y1="115" x2="76" y2="117" />
      </g>

      {/* Petite touffe de mousse (en bas à gauche) */}
      <g fill="#4CAF50" stroke="#1A1A1A" strokeWidth="1.5">
        <circle cx="40" cy="142" r="4" />
        <circle cx="46" cy="140" r="3.5" />
        <circle cx="43" cy="137" r="3" />
      </g>

      {/* Petite touffe de mousse (en bas à droite) */}
      <g fill="#66BB6A" stroke="#1A1A1A" strokeWidth="1.5">
        <circle cx="78" cy="143" r="3.5" />
        <circle cx="73" cy="141" r="3" />
      </g>

      {/* Petit caillou à côté */}
      <path
        d="M24 150 L28 144 L34 143 L38 146 L36 150 L28 152 Z"
        fill="#D6D3D1"
        stroke="#1A1A1A"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Sol / herbe */}
      <g stroke="#4CAF50" strokeWidth="2" strokeLinecap="round">
        <path d="M18 152 Q20 146 22 152" />
        <path d="M30 153 Q32 148 34 153" />
        <path d="M85 152 Q87 147 89 152" />
        <path d="M94 153 Q96 148 98 153" />
        <path d="M50 153 Q52 149 54 153" />
      </g>

      {/* Petits éclats / impact (style BD) */}
      <g stroke="#FFB800" strokeWidth="2" strokeLinecap="round" opacity="0.6">
        <line x1="56" y1="2" x2="58" y2="-4" />
        <line x1="50" y1="4" x2="45" y2="-1" />
        <line x1="64" y1="2" x2="68" y2="-3" />
        <line x1="70" y1="6" x2="76" y2="1" />
        <line x1="45" y1="8" x2="39" y2="4" />
      </g>
    </svg>
  );
}
