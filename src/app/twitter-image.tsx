import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Le Menhir - Rencontres entre hommes";
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B3A5C",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Cercles décoratifs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />
        
        {/* Logo Menhir cartoon */}
        <svg
          width="180"
          height="290"
          viewBox="0 0 300 420"
          style={{ marginBottom: 20 }}
        >
          {/* Ombre */}
          <ellipse cx="150" cy="400" rx="100" ry="18" fill="rgba(0,0,0,0.3)" />
          {/* Contour pierre */}
          <path
            d="M150 15 C120 15 100 35 90 65 C80 95 74 135 72 185 C70 228 74 262 82 290 C90 318 102 334 118 340 L182 340 C198 334 210 318 218 290 C226 262 230 228 228 185 C226 135 220 95 210 65 C200 35 180 15 150 15 Z"
            fill="#2D2D2D"
            stroke="#1a1a1a"
            strokeWidth="3"
          />
          {/* Intérieur gris */}
          <path
            d="M150 24 C124 24 106 42 97 70 C86 98 81 136 80 185 C78 226 82 258 90 285 C98 312 110 326 126 332 L174 332 C190 326 202 312 210 285 C218 258 222 226 220 185 C218 136 214 98 203 70 C194 42 176 24 150 24 Z"
            fill="#8C8C8C"
          />
          {/* Reflet */}
          <path
            d="M128 34 C118 42 110 62 104 94 C98 126 96 158 98 190 C100 216 104 238 110 255 L118 255 C114 238 110 216 108 190 C106 158 108 126 114 94 C120 62 130 46 138 34 Z"
            fill="rgba(255,255,255,0.15)"
          />
          {/* Fissure principale */}
          <path
            d="M144 75 C140 105 148 135 142 175 C136 215 146 245 140 285"
            fill="none"
            stroke="#666"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Petite fissure */}
          <path
            d="M142 175 L166 155"
            fill="none"
            stroke="#666"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Herbe */}
          <ellipse cx="78" cy="338" rx="20" ry="16" fill="#4A7C3F" />
          <ellipse cx="108" cy="342" rx="16" ry="13" fill="#5A9C4A" />
          <ellipse cx="192" cy="342" rx="16" ry="13" fill="#5A9C4A" />
          <ellipse cx="224" cy="338" rx="20" ry="16" fill="#4A7C3F" />
          <ellipse cx="150" cy="344" rx="14" ry="12" fill="#4A7C3F" />
        </svg>

        {/* Nom du site */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: 8,
          }}
        >
          Le Menhir
        </div>

        {/* Slogan */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.7)",
          }}
        >
          Rencontres entre hommes
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
