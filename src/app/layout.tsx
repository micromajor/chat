import type { Metadata } from "next";
import { Inter, Montserrat, Bangers, Comic_Neue } from "next/font/google";
import { Providers } from "./providers";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { CookieConsent } from "@/components/ui/cookie-consent";
import "@/styles/globals.css";
import "@/styles/comic-theme.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// Fonts BD (thème comic Astérix)
const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
  display: "swap",
});

const comicNeue = Comic_Neue({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-comic-neue",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://menhir.chat"),
  title: {
    default: "Le Menhir - Rencontres entre hommes",
    template: "%s | Le Menhir",
  },
  description:
    "Le Menhir est la plateforme de rencontres gratuite dédiée aux hommes. Chat privé, profils vérifiés, messagerie sécurisée. Solide comme la pierre !",
  keywords: ["rencontres", "gay", "hommes", "chat", "messagerie", "gratuit", "France", "menhir", "rencontre homme", "tchat gay", "site rencontre gratuit"],
  authors: [{ name: "Le Menhir" }],
  creator: "Le Menhir",
  publisher: "Le Menhir",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://menhir.chat",
  },
  openGraph: {
    title: "Le Menhir - Rencontres entre hommes",
    description: "La plateforme de rencontres gratuite dédiée aux hommes. Solide comme la pierre !",
    type: "website",
    locale: "fr_FR",
    siteName: "Le Menhir",
    url: "https://menhir.chat",
  },
  twitter: {
    card: "summary_large_image",
    title: "Le Menhir - Rencontres entre hommes",
    description: "La plateforme de rencontres gratuite dédiée aux hommes. Solide comme la pierre !",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  category: "social networking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="comic-theme" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
        <meta name="theme-color" content="#DC2626" />
        {/* Données structurées JSON-LD pour le SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Le Menhir",
              alternateName: "Le Menhir Chat",
              url: "https://menhir.chat",
              description: "Plateforme de rencontres gratuite dédiée aux hommes. Chat privé et sécurisé.",
              inLanguage: "fr-FR",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://menhir.chat/explorer/recherche?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Google AdSense Auto Ads - Place automatiquement les pubs */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} ${bangers.variable} ${comicNeue.variable} font-sans antialiased`}
      >
        <GoogleAnalytics />
        <Providers>{children}</Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
