import { redirect } from "next/navigation";

/**
 * La page /explorer affichait des profils fictifs visibles sans connexion,
 * ce qui a déclenché un signalement "page trompeuse" sur Google Safe Browsing.
 * On redirige désormais vers /connexion.
 */
export default function ExplorerPage() {
  redirect("/connexion");
}

// Wrapper pour les icônes Lucide
function IconWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}

// Données de démonstration pour le mode invité
const demoUsers = [
  {
    id: "demo1",
    pseudo: "Menhir_28451",
    age: 28,
    city: "Paris",
    avatar: null,
    isOnline: true,
    description: "Passionné de voyages et de découvertes...",
  },
  {
    id: "demo2",
    pseudo: "Menhir_34102",
    age: 34,
    city: "Lyon",
    avatar: null,
    isOnline: true,
    description: "Sportif, cinéphile, amateur de bons restos.",
  },
  {
    id: "demo3",
    pseudo: "Menhir_26833",
    age: 26,
    city: "Bordeaux",
    avatar: null,
    isOnline: false,
    description: "À la recherche de nouvelles rencontres...",
  },
  {
    id: "demo4",
    pseudo: "Menhir_31007",
    age: 31,
    city: "Marseille",
    avatar: null,
    isOnline: true,
    description: "Amoureux de la mer et du soleil ☀️",
  },
  {
    id: "demo5",
    pseudo: "Menhir_29445",
    age: 29,
    city: "Nantes",
    avatar: null,
    isOnline: false,
    description: "Musicien, rêveur, curieux de tout.",
  },
  {
    id: "demo6",
    pseudo: "Menhir_25118",
    age: 25,
    city: "Lille",
    avatar: null,
    isOnline: true,
    description: "Étudiant en médecine, fan de séries.",
  },
  {
    id: "demo7",
    pseudo: "Menhir_32956",
    age: 32,
    city: "Toulouse",
    avatar: null,
    isOnline: false,
    description: "Ingénieur aéro, passionné d'espace 🚀",
  },
  {
    id: "demo8",
    pseudo: "Menhir_27089",
    age: 27,
    city: "Nice",
    avatar: null,
    isOnline: true,
    description: "La dolce vita sur la Côte d'Azur.",
  },
];

export default function ExplorerPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  const handleAction = (action: string) => {
    setSelectedAction(action);
    setShowAuthModal(true);
  };

  const onlineUsers = demoUsers.filter((u) => u.isOnline);
  const offlineUsers = demoUsers.filter((u) => !u.isOnline);

  return (
    <div className="flex gap-6">
      {/* Contenu principal */}
      <div className="flex-1">
        {/* Bannière d'accueil */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <IconWrapper className="w-6 h-6"><Eye /></IconWrapper>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold">Mode Découverte</h1>
              <p className="text-white/80 text-sm">
                Explore les profils en mode anonyme. Inscris-toi pour interagir !
              </p>
            </div>
          </div>
        </div>

        {/* Membres en ligne */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              En ligne maintenant
              <span className="text-sm font-normal text-gray-500">
                ({onlineUsers.length})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {onlineUsers.map((user, index) => (
              <GuestUserCard
                key={user.id}
                user={user}
                onAction={handleAction}
                showAd={index === 3}
              />
            ))}
          </div>
        </section>

        {/* Autres membres */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Autres profils
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({offlineUsers.length})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {offlineUsers.map((user) => (
              <GuestUserCard key={user.id} user={user} onAction={handleAction} />
            ))}
          </div>
        </section>

        {/* CTA Inscription */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconWrapper className="w-8 h-8 text-accent-500"><Sparkles /></IconWrapper>
          </div>
          <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Tu aimes ce que tu vois ?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Crée ton compte gratuit pour envoyer des messages, des likes et
            voir qui s'intéresse à ton profil !
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/inscription">
              <Button variant="accent" size="lg">
                <IconWrapper className="w-5 h-5 mr-2"><UserPlus /></IconWrapper>
                Créer mon compte gratuit
              </Button>
            </Link>
            <Link href="/connexion">
              <Button variant="outline" size="lg">
                J'ai déjà un compte
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:block w-[300px] flex-shrink-0">
        <div className="sticky top-32 space-y-6">
          {/* Incitation inscription */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Pourquoi s'inscrire ?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Envoyer des messages privés
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Voir qui t'a liké
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Créer ton profil
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Recevoir des notifications
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                100% gratuit
              </li>
            </ul>
            <Link href="/inscription" className="block mt-4">
              <Button variant="accent" className="w-full" size="sm">
                S'inscrire maintenant
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Modal d'authentification */}
      {showAuthModal && (
        <AuthPromptModal
          action={selectedAction}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

// Carte utilisateur pour le mode invité
function GuestUserCard({
  user,
  onAction,
  showAd = false,
}: {
  user: (typeof demoUsers)[0];
  onAction: (action: string) => void;
  showAd?: boolean;
}) {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group">
        <div className="relative">
          {/* Avatar placeholder */}
          <div className="aspect-square bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-4xl font-bold text-white/80">
              {user.pseudo.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Badge en ligne */}
          {user.isOnline && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              En ligne
            </div>
          )}

          {/* Overlay au hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="accent"
              size="sm"
              onClick={() => onAction("view_full")}
            >
              <IconWrapper className="w-4 h-4 mr-1"><Eye /></IconWrapper>
              Voir le profil
            </Button>
          </div>
        </div>

        <div className="p-3">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {user.pseudo}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.age} ans • {user.city}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
            {user.description}
          </p>
        </div>
      </div>
    </>
  );
}

// Modal d'incitation
function AuthPromptModal({
  action,
  onClose,
}: {
  action: string;
  onClose: () => void;
}) {
  const messages: Record<string, { title: string; description: string }> = {
    view_full: {
      title: "Voir le profil complet",
      description: "Créez un compte gratuit pour accéder à tous les détails et envoyer un message.",
    },
    like: {
      title: "Envoyer un like",
      description: "Inscris-toi pour montrer ton intérêt et voir tes matchs.",
    },
    message: {
      title: "Envoyer un message",
      description: "Crée ton profil pour discuter en privé avec ce membre.",
    },
  };

  const msg = messages[action] || messages.view_full;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconWrapper className="w-8 h-8 text-primary-500"><UserPlus /></IconWrapper>
          </div>

          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            {msg.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {msg.description}
          </p>

          <div className="space-y-3">
            <Link href="/inscription" className="block">
              <Button variant="accent" className="w-full">
                Créer un compte gratuit
              </Button>
            </Link>

            <Link href="/connexion" className="block">
              <Button variant="outline" className="w-full">
                J'ai déjà un compte
              </Button>
            </Link>

            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Continuer à explorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
