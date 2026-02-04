import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            Vérifiez votre email
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Nous avons envoyé un email de confirmation à votre adresse. Cliquez
            sur le lien dans l'email pour activer votre compte.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              💡 Pensez à vérifier vos spams si vous ne trouvez pas l'email.
            </p>
          </div>

          <Link
            href="/connexion"
            className="inline-flex items-center gap-2 text-accent-500 hover:text-accent-600 font-medium"
          >
            Aller à la connexion
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
