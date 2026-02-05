import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion - Menhir",
  description: "Connecte-toi à Menhir pour retrouver tes conversations et tes contacts. Chat privé entre hommes, gratuit et sécurisé.",
  openGraph: {
    title: "Connexion - Menhir",
    description: "Connecte-toi à Menhir pour retrouver tes conversations et tes contacts.",
  },
};

export default function ConnexionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
