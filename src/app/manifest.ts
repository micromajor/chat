import { MetadataRoute } from "next";

/**
 * Web App Manifest pour le SEO et PWA
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Menhir - Rencontres entre hommes",
    short_name: "Menhir",
    description: "Chat gratuit et privé entre hommes. Solide comme la pierre !",
    start_url: "/",
    display: "standalone",
    background_color: "#1C1917",
    theme_color: "#DC2626",
    orientation: "portrait",
    categories: ["social", "lifestyle"],
    lang: "fr",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
