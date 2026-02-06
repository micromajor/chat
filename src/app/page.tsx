"use client";

import Link from "next/link";
import { MessageCircle, Shield, Heart, Sparkles, Zap, UserPlus, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { MenhirLogo } from "@/components/ui/menhir-logo";

export default function HomePage() {
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [showCount, setShowCount] = useState(false);

  useEffect(() => {
    // Récupérer le nombre d'utilisateurs en ligne
    fetch("/api/stats/online")
      .then((res) => res.json())
      .then((data) => {
        if (data.showCount) {
          setOnlineCount(data.count);
          setShowCount(true);
        }
      })
      .catch(() => {
        // En cas d'erreur, ne rien afficher
      });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo "Le Menhir" avec l'icône à la place du i */}
          <div className="flex justify-center items-end mb-8">
            <span className="text-6xl md:text-8xl font-heading font-bold text-white drop-shadow-lg leading-none">
              Le Menhir
            </span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>100% gratuit • Inscription rapide</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            Chat gratuit et privé entre mecs.
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Viens faire de nouvelles rencontres !
          </p>

          {/* Options d'accès avec descriptions */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Accès Membre */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 transition-all border border-white/20 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <UserPlus className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-1">Accès Membre</h3>
                    <p className="text-sm text-white/70">Pseudo personnalisé • Profil complet • Historique sauvegardé</p>
                  </div>
                </div>
                <Link
                  href="/connexion"
                  className="block w-full bg-white text-primary-600 hover:bg-accent-100 px-6 py-3 rounded-xl font-bold text-center transition-all shadow-lg hover:shadow-xl"
                >
                  Connexion
                </Link>
                <Link
                  href="/inscription"
                  className="block w-full mt-2 text-white/80 hover:text-white text-sm text-center py-2"
                >
                  Pas encore membre ? Inscription →
                </Link>
              </div>

              {/* Accès Rapide */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 transition-all border border-white/20 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent-400 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-1">Accès Rapide</h3>
                    <p className="text-sm text-white/70">Pseudo auto-généré • Accès immédiat • Messages temporaires</p>
                  </div>
                </div>
                <Link
                  href="/acces-rapide"
                  className="block w-full bg-accent-500 text-white hover:bg-accent-600 px-6 py-3 rounded-xl font-bold text-center transition-all shadow-lg hover:shadow-xl"
                >
                  Anonyme
                </Link>
                <p className="text-xs text-white/60 text-center mt-2">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Messages supprimés à la déconnexion
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats - Afficher uniquement si > 50 connectés */}
          {showCount && onlineCount && (
            <div className="flex justify-center gap-8 mt-12">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4">
                <div className="text-3xl font-bold text-white">{onlineCount}</div>
                <div className="text-white/70 text-sm flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Connectés maintenant
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <FeatureCard
            icon={<MessageCircle className="w-7 h-7" />}
            title="Tchat privé 💬"
            description="Conversations en tête-à-tête, sans salons collectifs. Ta vie privée est respectée."
            color="bg-gradient-to-br from-pink-500 to-rose-600"
          />
          <FeatureCard
            icon={<Shield className="w-7 h-7" />}
            title="Safe zone 🛡️"
            description="Profils vérifiés, modération active et blocage instantané. Tu es en sécurité ici."
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <FeatureCard
            icon={<Heart className="w-7 h-7" />}
            title="Vraiment gratuit 💯"
            description="Pas d'abonnement. Viens comme tu es !"
            color="bg-gradient-to-br from-violet-500 to-purple-600"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/70 text-sm">
          <p>© 2026 Le Menhir. Tous droits réservés. 🪨</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link href="/cgu" className="hover:text-white transition-colors">
              CGU
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
        <p className="text-center text-white/50 text-xs mt-4">
          Site réservé aux personnes majeures (18 ans et plus)
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 hover:bg-white/15 transition-all hover:scale-105">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-heading font-bold text-white mb-2">
        {title}
      </h3>
      <p className="text-white/80">{description}</p>
    </div>
  );
}
