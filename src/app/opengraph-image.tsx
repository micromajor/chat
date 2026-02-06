import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Le Menhir - Rencontres entre hommes";
export const size = {
  width: 1200,
  height: 630,
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
          background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #F59E0B 100%)",
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
            background: "rgba(255,255,255,0.05)",
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
            background: "rgba(255,255,255,0.05)",
          }}
        />
        
        {/* Logo Menhir (pierre dressée) */}
        <svg
          width="200"
          height="320"
          viewBox="0 0 200 320"
          style={{ marginBottom: 30 }}
        >
          <path
            d="M100 0 C70 0 50 25 40 55 L30 110 L25 190 C22 230 45 285 70 305 L80 315 L120 315 L130 305 C155 285 178 230 175 190 L170 110 L160 55 C150 25 130 0 100 0 Z"
            fill="white"
          />
          {/* Texture */}
          <ellipse cx="80" cy="95" rx="20" ry="12" fill="rgba(0,0,0,0.06)" />
          <ellipse cx="120" cy="170" rx="17" ry="10" fill="rgba(0,0,0,0.04)" />
          <ellipse cx="95" cy="240" rx="25" ry="14" fill="rgba(0,0,0,0.03)" />
        </svg>

        {/* Nom du site */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: 10,
          }}
        >
          Le Menhir
        </div>

        {/* Slogan */}
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Solide comme la pierre 🪨
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
