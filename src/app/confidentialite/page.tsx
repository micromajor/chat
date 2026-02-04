import Link from "next/link";

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">
          Politique de Confidentialité
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 space-y-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Chez Menhir, nous nous engageons à protéger votre vie privée. Cette
              politique de confidentialité explique comment nous collectons, utilisons
              et protégeons vos données personnelles conformément au Règlement Général
              sur la Protection des Données (RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Données collectées
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nous collectons les données suivantes :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Données d'inscription :</strong> email, mot de passe (crypté),
                pseudo, date de naissance, ville
              </li>
              <li>
                <strong>Données de profil :</strong> photo de profil, description,
                critères de recherche
              </li>
              <li>
                <strong>Données d'utilisation :</strong> messages échangés, likes,
                historique de connexion
              </li>
              <li>
                <strong>Données techniques :</strong> adresse IP, type de navigateur,
                appareil utilisé
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Utilisation des données
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Fournir et améliorer le service Menhir</li>
              <li>Permettre la communication entre utilisateurs</li>
              <li>Personnaliser votre expérience et vos recommandations</li>
              <li>Assurer la sécurité et la modération de la plateforme</li>
              <li>Afficher des publicités personnalisées (via Google AdSense)</li>
              <li>Vous envoyer des notifications relatives au service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Base légale du traitement
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nous traitons vos données sur les bases légales suivantes :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Exécution du contrat :</strong> pour fournir le service
              </li>
              <li>
                <strong>Consentement :</strong> pour les cookies et publicités
                personnalisées
              </li>
              <li>
                <strong>Intérêt légitime :</strong> pour la sécurité et l'amélioration
                du service
              </li>
              <li>
                <strong>Obligation légale :</strong> pour répondre aux réquisitions
                judiciaires
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Conservation des données
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nous conservons vos données selon les durées suivantes :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Données de compte :</strong> pendant toute la durée de votre
                inscription + 1 an après suppression
              </li>
              <li>
                <strong>Messages :</strong> 3 ans maximum
              </li>
              <li>
                <strong>Logs de connexion :</strong> 1 an
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Partage des données
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Vos données peuvent être partagées avec :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Nos prestataires techniques :</strong> hébergement,
                stockage d'images
              </li>
              <li>
                <strong>Google AdSense :</strong> pour l'affichage de publicités
              </li>
              <li>
                <strong>Autorités compétentes :</strong> sur réquisition judiciaire
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Nous ne vendons jamais vos données personnelles à des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Vos droits
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Droit d'accès :</strong> obtenir une copie de vos données
              </li>
              <li>
                <strong>Droit de rectification :</strong> corriger vos données
              </li>
              <li>
                <strong>Droit à l'effacement :</strong> supprimer votre compte et
                vos données
              </li>
              <li>
                <strong>Droit à la portabilité :</strong> recevoir vos données dans
                un format structuré
              </li>
              <li>
                <strong>Droit d'opposition :</strong> vous opposer au traitement de
                vos données
              </li>
              <li>
                <strong>Droit de limitation :</strong> limiter le traitement de vos
                données
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Pour exercer ces droits, contactez-nous via la page{" "}
              <Link href="/contact" className="text-primary-500 hover:underline">
                Contact
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Cookies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Nous utilisons les cookies suivants :
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <strong>Cookies essentiels :</strong> authentification, préférences
              </li>
              <li>
                <strong>Cookies analytiques :</strong> statistiques d'utilisation
              </li>
              <li>
                <strong>Cookies publicitaires :</strong> personnalisation des publicités
              </li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Vous pouvez gérer vos préférences de cookies à tout moment dans les
              paramètres de votre navigateur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Sécurité
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Nous mettons en œuvre des mesures de sécurité techniques et
              organisationnelles pour protéger vos données : chiffrement des mots de
              passe, connexions HTTPS, accès restreint aux données, audits de sécurité
              réguliers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Contact et réclamations
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Pour toute question relative à vos données personnelles, contactez notre
              Délégué à la Protection des Données via la page{" "}
              <Link href="/contact" className="text-primary-500 hover:underline">
                Contact
              </Link>
              . Vous avez également le droit d'introduire une réclamation auprès de la
              CNIL (Commission Nationale de l'Informatique et des Libertés).
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
