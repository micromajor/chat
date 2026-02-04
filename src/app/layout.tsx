import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Providers } from "./providers";
import "@/styles/globals.css";

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

export const metadata: Metadata = {
  title: "Menhir - Rencontres entre hommes",
  description:
    "Menhir est la plateforme de rencontres gratuite dédiée aux hommes. Chat privé, profils vérifiés, messagerie sécurisée. Solide comme la pierre !",
  keywords: ["rencontres", "gay", "hommes", "chat", "messagerie", "gratuit", "France", "menhir"],
  authors: [{ name: "Menhir" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Menhir - Rencontres entre hommes",
    description: "La plateforme de rencontres gratuite dédiée aux hommes. Solide comme la pierre !",
    type: "website",
    locale: "fr_FR",
    siteName: "Menhir",
  },
  twitter: {
    card: "summary_large_image",
    title: "Menhir - Rencontres entre hommes",
    description: "La plateforme de rencontres gratuite dédiée aux hommes. Solide comme la pierre !",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1E3A5F" />
        {/* Google AdSense - À configurer avec votre ID */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
