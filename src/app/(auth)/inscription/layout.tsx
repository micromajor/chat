import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription - Menhir",
  description: "Inscris-toi gratuitement sur Menhir. Crée ton profil, choisis ton pseudo et commence à chatter avec d'autres hommes. 100% gratuit !",
  openGraph: {
    title: "Inscription gratuite - Menhir",
    description: "Crée ton profil gratuitement sur Menhir et commence à faire de nouvelles rencontres.",
  },
};

export default function InscriptionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
