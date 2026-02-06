"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  Users,
  Heart,
  User,
  Settings,
  LogOut,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { AdBannerHorizontal } from "@/components/ads/ad-banner";
import { useAuth } from "@/contexts/auth-context";
import { useUnreadMessages } from "@/contexts/unread-messages-context";
import { MenhirLogo } from "@/components/ui/menhir-logo";

interface MainLayoutProps {
  children: React.ReactNode;
  user?: {
    id: string;
    pseudo: string;
    avatar?: string;
  };
}

export function MainLayout({ children, user: propUser }: MainLayoutProps) {
  const pathname = usePathname();
  const { user: authUser, logout, quickAccessToken } = useAuth();
  const { unreadCount } = useUnreadMessages();

  // Utiliser l'utilisateur du contexte ou celui passé en prop
  const user = authUser || propUser;

  // Si pas d'utilisateur, ne pas afficher
  if (!user) {
    return (
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
        {children}
      </div>
    );
  }

  const navigation = [
    {
      name: "Découvrir",
      href: "/dashboard",
      icon: Users,
      active: pathname === "/dashboard",
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageCircle,
      badge: unreadCount,
      active: pathname.startsWith("/messages"),
    },
    {
      name: "Likes",
      href: "/likes",
      icon: Heart,
      active: pathname === "/likes",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        {/* Bannière publicitaire */}
        <div className="hidden lg:block border-b border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-4 py-2">
            <AdBannerHorizontal />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
                <MenhirLogo className="w-6 h-6 text-white" />
              </div>
              {/* Logo complet en desktop, caché en mobile */}
              <div className="hidden sm:block">
                <span className="text-xl font-heading font-bold text-primary-500">
                  Le Menhir
                </span>
                <span className="block text-[10px] text-gray-400 -mt-1">Solide comme la pierre</span>
              </div>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative",
                    item.active
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-500"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg animate-pulse border-2 border-white dark:border-gray-900">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Menu profil */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  {/* Pseudo en mobile - à gauche de l'avatar */}
                  <span className="sm:hidden text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                    {user.pseudo}
                  </span>
                  <Avatar
                    src={user.avatar}
                    alt={user.pseudo}
                    size="sm"
                    showOnlineStatus
                    isOnline
                  />
                  {/* Pseudo en desktop - à droite de l'avatar */}
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.pseudo}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-2">
                    {!authUser?.isQuickAccess && (
                      <>
                        <Link
                          href="/profil"
                          className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <User className="w-4 h-4" />
                          Mon profil
                        </Link>
                        <Link
                          href="/parametres"
                          className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <Settings className="w-4 h-4" />
                          Paramètres
                        </Link>
                      </>
                    )}
                    {authUser?.isQuickAccess && (
                      <Link
                        href="/inscription"
                        className="flex items-center gap-2 px-3 py-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                      >
                        <UserPlus className="w-4 h-4" />
                        Créer un compte
                      </Link>
                    )}
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Navigation mobile fixe */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="flex justify-around py-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 relative",
                item.active
                  ? "text-primary-500"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs">{item.name}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 right-1 min-w-[20px] h-[20px] bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white dark:border-gray-900">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
