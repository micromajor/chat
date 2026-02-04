import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Vérifie un token d'accès rapide et retourne l'utilisateur associé
 */
export async function verifyQuickAccessToken(token: string) {
  if (!token) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { quickAccessToken: token },
      select: {
        id: true,
        pseudo: true,
        avatar: true,
        isQuickAccess: true,
        isBanned: true,
        isOnline: true,
      },
    });

    if (!user || user.isBanned) return null;

    // Mettre à jour le statut en ligne
    await prisma.user.update({
      where: { id: user.id },
      data: { isOnline: true, lastSeenAt: new Date() },
    });

    return user;
  } catch {
    return null;
  }
}

/**
 * Récupère l'utilisateur depuis la requête (NextAuth ou QuickAccess)
 */
export async function getUserFromRequest(request: Request) {
  // Vérifier d'abord le header d'accès rapide
  const quickAccessToken = request.headers.get("X-Quick-Access-Token");
  
  if (quickAccessToken) {
    return await verifyQuickAccessToken(quickAccessToken);
  }

  // Sinon, vérifier la session NextAuth
  const session = await getServerSession(authOptions);
  if (session?.user) {
    // Mettre à jour le statut en ligne pour les utilisateurs NextAuth également
    try {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { isOnline: true, lastSeenAt: new Date() },
      });
    } catch {
      // Ignorer les erreurs de mise à jour
    }

    return {
      id: session.user.id,
      pseudo: session.user.pseudo || "Utilisateur",
      avatar: session.user.avatar,
      isQuickAccess: false,
      isBanned: false,
      isOnline: true,
    };
  }

  return null;
}

/**
 * Middleware pour les routes API - retourne l'utilisateur ou une erreur 401
 */
export async function requireAuth(request: Request) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      ),
    };
  }

  return { user, error: null };
}
