"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, AlertCircle, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Simulation d'envoi (en production, il faudrait un API endpoint)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-8">
          Contact
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Informations de contact */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Nous contacter
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Une question, une suggestion ou un problème ? N'hésitez pas à nous
                contacter. Nous vous répondrons dans les plus brefs délais.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      contact@menhir.fr
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-accent-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Support
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      support@menhir.fr
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Signalement urgent
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      abuse@menhir.fr
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Temps de réponse
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Nous nous efforçons de répondre à toutes les demandes dans un délai
                de 48 heures ouvrées. Les signalements urgents sont traités en
                priorité.
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Message envoyé !
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Nous avons bien reçu votre message et nous vous répondrons
                  rapidement.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setIsSuccess(false)}
                >
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sujet
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Choisir un sujet</option>
                    <option value="question">Question générale</option>
                    <option value="bug">Signalement de bug</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="account">Problème de compte</option>
                    <option value="report">Signalement d'abus</option>
                    <option value="rgpd">Demande RGPD</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={5}
                    placeholder="Décrivez votre demande..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Envoyer le message
                </Button>
              </form>
            )}
          </div>
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
