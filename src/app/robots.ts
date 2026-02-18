import { MetadataRoute } from "next";

/**
 * robots.txt dynamique pour le SEO
 * Accessible à : https://menhir.chat/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://menhir.chat";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/connexion", "/inscription", "/acces-rapide", "/cgu", "/confidentialite", "/mentions-legales", "/contact"],
        disallow: ["/api/", "/dashboard/", "/messages/", "/profil/", "/parametres/", "/likes/", "/recherche/", "/notifications/", "/explorer/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
