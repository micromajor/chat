import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Menhir",
  description: "Contacte l'équipe Menhir pour toute question, signalement ou suggestion. Nous sommes à ton écoute.",
  openGraph: {
    title: "Contact - Menhir",
    description: "Contacte l'équipe Menhir pour toute question ou signalement.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
