"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageCircle,
  Users,
  Search,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdBannerHorizontal } from "@/components/ads/ad-banner";
import { Button } from "@/components/ui/button";
import { MenhirLogo } from "@/components/ui/menhir-logo";

interface GuestLayoutProps {
  children: React.ReactNode;
}

// Wrapper pour les icônes
function Icon({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}

export function GuestLayout({ children }: GuestLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isExplorerActive = pathname === "/explorer";
  const isRechercheActive = pathname === "/explorer/recherche";

  const handleExitGuestMode = () => {
    localStorage.removeItem("guestMode");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      {/* Banner d'incitation à l'inscription */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-4 text-center text-sm">
        <span className="mr-2">Inscris-toi gratuitement pour accéder à toutes les fonctionnalités !</span>
        <Link
          href="/inscription"
          className="underline font-medium hover:text-accent-300"
        >
          Créer un compte
        </Link>
      </div>

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <MenhirLogo className="w-6 h-6 text-white" />
              </div>
              <span className="hidden sm:block text-xl font-heading font-bold text-gray-900 dark:text-white">
                Menhir
              </span>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/explorer"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  isExplorerActive
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon className="w-5 h-5"><Users /></Icon>
                <span>Découvrir</span>
              </Link>
              <Link
                href="/explorer/recherche"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                  isRechercheActive
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon className="w-5 h-5"><Search /></Icon>
                <span>Recherche</span>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link href="/connexion">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/inscription">
                <Button variant="accent" size="sm">
                  <Icon className="w-4 h-4 mr-2"><UserPlus /></Icon>
                  S'inscrire
                </Button>
              </Link>

              {/* Menu mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-400"
              >
                {isMobileMenuOpen ? (
                  <Icon className="w-6 h-6"><X /></Icon>
                ) : (
                  <Icon className="w-6 h-6"><Menu /></Icon>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4">
            <nav className="px-4 space-y-2">
              <Link
                href="/explorer"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isExplorerActive
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                <Icon className="w-5 h-5"><Users /></Icon>
                <span>Découvrir</span>
              </Link>
              <Link
                href="/explorer/recherche"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isRechercheActive
                    ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                <Icon className="w-5 h-5"><Search /></Icon>
                <span>Recherche</span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Pub header */}
      <div className="bg-gray-100 dark:bg-gray-800 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <AdBannerHorizontal />
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>

      {/* Footer simplifié */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/cgu" className="hover:text-primary-500">CGU</Link>
            <Link href="/confidentialite" className="hover:text-primary-500">Confidentialité</Link>
            <Link href="/mentions-legales" className="hover:text-primary-500">Mentions légales</Link>
            <Link href="/contact" className="hover:text-primary-500">Contact</Link>
          </div>
          <p className="text-xs text-gray-400">
            Mode visiteur • <button onClick={handleExitGuestMode} className="underline hover:text-primary-500">Quitter</button>
          </p>
        </div>
      </footer>
    </div>
  );
}
