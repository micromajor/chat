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
        src: "/favicon.ico",
        sizes: "64x64",
        type: "image/x-icon",
      },
    ],
  };
}
