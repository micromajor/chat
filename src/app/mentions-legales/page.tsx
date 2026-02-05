import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales - Menhir",
  description: "Mentions légales du site Menhir.chat - Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">
          Mentions Légales
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Éditeur du site
            </h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-2">
              <p>
                <strong>Nom du site :</strong> Menhir
              </p>
              <p>
                <strong>URL :</strong> https://menhir.fr
              </p>
              <p>
                <strong>Directeur de la publication :</strong> [Nom du responsable]
              </p>
              <p>
                <strong>Email :</strong> contact@menhir.fr
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Hébergeur
            </h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-2">
              <p>
                <strong>Raison sociale :</strong> Vercel Inc.
              </p>
              <p>
                <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA
              </p>
              <p>
                <strong>Site web :</strong> https://vercel.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Nature du service
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Menhir est une plateforme de rencontres et de messagerie privée
              destinée aux hommes majeurs (18 ans et plus). Le service est gratuit et
              financé par la publicité. L'inscription est réservée aux personnes
              majeures qui déclarent sur l'honneur avoir plus de 18 ans.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Propriété intellectuelle
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              L'ensemble du contenu du site Menhir (textes, images, graphismes,
              logo, icônes, sons, logiciels, etc.) est la propriété exclusive de
              Menhir ou de ses partenaires. Toute reproduction, représentation,
              modification, publication ou adaptation de tout ou partie des éléments
              du site, quel que soit le moyen ou le procédé utilisé, est interdite
              sans autorisation écrite préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Limitation de responsabilité
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Menhir ne pourra être tenue responsable :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                Des dommages directs ou indirects résultant de l'utilisation du site
              </li>
              <li>
                Du contenu publié par les utilisateurs sur la plateforme
              </li>
              <li>
                Des rencontres ou relations nouées via le service
              </li>
              <li>
                Des interruptions temporaires du service pour maintenance
              </li>
              <li>
                De l'exactitude des informations fournies par les utilisateurs
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Obligations légales (LCEN)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Conformément à la Loi pour la Confiance dans l'Économie Numérique
              (LCEN) du 21 juin 2004, Menhir s'engage à :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                Permettre le signalement de tout contenu manifestement illicite
              </li>
              <li>
                Retirer promptement tout contenu signalé comme illicite
              </li>
              <li>
                Conserver les données d'identification des utilisateurs
              </li>
              <li>
                Coopérer avec les autorités compétentes sur réquisition judiciaire
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Protection des mineurs
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Menhir est un site réservé aux personnes majeures (18 ans et plus).
              Tout contenu impliquant des mineurs est strictement interdit et sera
              immédiatement signalé aux autorités compétentes. Les utilisateurs
              s'engagent, lors de leur inscription, à déclarer sur l'honneur être
              majeurs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Signalement de contenu illicite
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Pour signaler un contenu illicite, vous pouvez utiliser le système de
              signalement intégré à la plateforme ou nous contacter directement via
              la page{" "}
              <Link href="/contact" className="text-primary-500 hover:underline">
                Contact
              </Link>
              . Nous nous engageons à traiter toute demande dans les plus brefs délais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Le site Menhir utilise des cookies pour son fonctionnement, les
              statistiques et la personnalisation des publicités. Pour plus
              d'informations, consultez notre{" "}
              <Link
                href="/confidentialite"
                className="text-primary-500 hover:underline"
              >
                Politique de Confidentialité
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Droit applicable et juridiction
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Les présentes mentions légales sont régies par le droit français. En cas
              de litige, et après échec de toute tentative de recherche d'une solution
              amiable, les tribunaux français seront seuls compétents.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-500 hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
