import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accès Rapide - Menhir",
  description: "Accède instantanément à Menhir sans inscription. Un pseudo anonyme t'est attribué pour chatter librement. Gratuit et immédiat !",
  openGraph: {
    title: "Accès Rapide - Menhir",
    description: "Accède au chat instantanément, sans inscription. Pseudo anonyme et accès immédiat.",
  },
};

export default function AccesRapideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
