import Link from "next/link";

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">
          Conditions Générales d'Utilisation
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 space-y-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Objet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et
              l'utilisation du service Menhir, plateforme de rencontres et de messagerie
              privée destinée aux hommes majeurs. L'utilisation du service implique
              l'acceptation pleine et entière des présentes CGU.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Accès au service
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Pour accéder au service, l'utilisateur doit :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Être âgé de 18 ans minimum</li>
              <li>Créer un compte avec une adresse email valide</li>
              <li>Vérifier son adresse email</li>
              <li>Accepter les présentes CGU et la politique de confidentialité</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              L'accès au service est gratuit. Le service est financé par la publicité
              affichée sur la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Inscription et compte utilisateur
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              L'utilisateur s'engage à fournir des informations exactes et à jour lors
              de son inscription. Chaque utilisateur est responsable de la confidentialité
              de ses identifiants de connexion.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              L'utilisateur s'engage à ne pas créer plusieurs comptes et à ne pas
              usurper l'identité d'un tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Comportements interdits
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sont strictement interdits sur Menhir :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Le harcèlement, les insultes ou tout comportement agressif</li>
              <li>La publication de contenus illégaux ou choquants</li>
              <li>L'usurpation d'identité</li>
              <li>Le spam ou la sollicitation commerciale</li>
              <li>Le partage de contenus impliquant des mineurs</li>
              <li>L'utilisation de robots ou scripts automatisés</li>
              <li>La collecte de données personnelles d'autres utilisateurs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Modération
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Menhir se réserve le droit de modérer les contenus et de suspendre
              ou supprimer tout compte ne respectant pas les présentes CGU, sans préavis
              ni indemnité. Les utilisateurs peuvent signaler tout comportement
              inapproprié via le système de signalement intégré.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Responsabilité
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Menhir est un simple intermédiaire technique et ne peut être tenu
              responsable :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Des contenus publiés par les utilisateurs</li>
              <li>Des rencontres ou échanges entre utilisateurs</li>
              <li>Des dommages directs ou indirects résultant de l'utilisation du service</li>
              <li>Des interruptions temporaires du service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Propriété intellectuelle
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              L'ensemble des éléments constituant le site Menhir (textes, images,
              logos, logiciels) sont la propriété exclusive de Menhir ou de ses
              partenaires. Toute reproduction, même partielle, est interdite sans
              autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Modification des CGU
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Menhir se réserve le droit de modifier les présentes CGU à tout moment.
              Les utilisateurs seront informés de toute modification substantielle par
              email ou notification sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Droit applicable
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Les présentes CGU sont régies par le droit français. En cas de litige,
              les tribunaux français seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Contact
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Pour toute question concernant les présentes CGU, vous pouvez nous
              contacter via la page{" "}
              <Link href="/contact" className="text-primary-500 hover:underline">
                Contact
              </Link>
              .
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-primary-500 hover:underline"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
