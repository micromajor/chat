import { GuestLayout } from "@/components/layout/guest-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorer les profils - Menhir",
  description: "Découvre les profils d'hommes connectés sur Menhir. Chat gratuit, rencontres et nouvelles amitiés.",
  openGraph: {
    title: "Explorer les profils - Menhir",
    description: "Découvre les profils d'hommes connectés sur Menhir.",
  },
};

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestLayout>{children}</GuestLayout>;
}
