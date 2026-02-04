"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token de vérification manquant");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
          // Rediriger vers la connexion après 3 secondes
          setTimeout(() => {
            router.push("/connexion");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error);
        }
      } catch {
        setStatus("error");
        setMessage("Une erreur est survenue lors de la vérification");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {status === "loading" && (
            <>
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Vérification en cours...
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Veuillez patienter pendant que nous vérifions votre email.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Email vérifié !
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <p className="text-sm text-gray-500">
                Redirection automatique vers la connexion...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                Erreur de vérification
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
              <Link
                href="/inscription"
                className="text-accent-500 hover:text-accent-600 font-medium"
              >
                Créer un nouveau compte
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}
