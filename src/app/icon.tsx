import { ImageResponse } from "next/og";

// Favicon PNG dynamique - Menhir cartoon
export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B3A5C",
          borderRadius: "12px",
        }}
      >
        <svg
          width="56"
          height="56"
          viewBox="0 0 120 160"
          fill="none"
        >
          {/* Ombre */}
          <ellipse cx="60" cy="152" rx="35" ry="6" fill="rgba(0,0,0,0.3)" />
          {/* Contour pierre */}
          <path
            d="M60 8 C48 8 40 18 36 32 C32 46 30 64 29 86 C28 104 30 118 34 130 C38 142 44 148 52 150 L68 150 C76 148 82 142 86 130 C90 118 92 104 91 86 C90 64 88 46 84 32 C80 18 72 8 60 8 Z"
            fill="#2D2D2D"
            stroke="#1a1a1a"
            strokeWidth="3"
          />
          {/* Intérieur gris */}
          <path
            d="M60 14 C50 14 43 22 40 34 C36 48 34 64 33 86 C32 102 34 116 38 126 C42 136 47 142 54 144 L66 144 C73 142 78 136 82 126 C86 116 88 102 87 86 C86 64 84 48 80 34 C77 22 70 14 60 14 Z"
            fill="#8C8C8C"
          />
          {/* Reflet */}
          <path
            d="M52 18 C47 22 44 34 42 48 C40 62 39 76 40 90 C41 100 42 108 45 114 L48 114 C46 108 45 100 44 90 C43 76 44 62 46 48 C48 34 52 24 56 18 Z"
            fill="rgba(255,255,255,0.18)"
          />
          {/* Fissure */}
          <path
            d="M57 38 C55 50 59 62 56 78 C53 94 58 106 55 118"
            fill="none"
            stroke="#666"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Petite fissure */}
          <path
            d="M56 78 L66 70"
            fill="none"
            stroke="#666"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Herbe */}
          <ellipse cx="32" cy="148" rx="8" ry="7" fill="#4A7C3F" />
          <ellipse cx="44" cy="150" rx="7" ry="6" fill="#5A9C4A" />
          <ellipse cx="76" cy="150" rx="7" ry="6" fill="#5A9C4A" />
          <ellipse cx="88" cy="148" rx="8" ry="7" fill="#4A7C3F" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
