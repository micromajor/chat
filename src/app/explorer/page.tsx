import { redirect } from "next/navigation";

/**
 * La page /explorer affichait des profils fictifs visibles sans connexion,
 * ce qui a déclenché un signalement "page trompeuse" sur Google Safe Browsing.
 * On redirige désormais vers /connexion.
 */
export default function ExplorerPage() {
  redirect("/connexion");
}
