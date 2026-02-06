/**
 * API Route pour nettoyer les utilisateurs inactifs
 * GET /api/cron/cleanup-inactive
 * 
 * Marque comme "hors ligne" les utilisateurs dont lastSeenAt > 5 minutes
 * Supprime les conversations des utilisateurs anonymes qui passent hors ligne
 * À appeler régulièrement (cron Vercel ou appel client)
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteConversationsForQuickAccessUser } from "@/lib/message-cleanup";

export async function GET(request: NextRequest) {
  try {
    // Vérifier le secret d'authentification pour les cron jobs
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Date limite : 5 minutes avant maintenant
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Trouver les utilisateurs ANONYMES qui vont passer hors ligne
    // Pour supprimer leurs conversations AVANT de les marquer hors ligne
    const anonymousUsersGoingOffline = await prisma.user.findMany({
      where: {
        isOnline: true,
        isQuickAccess: true,
        lastSeenAt: {
          lt: fiveMinutesAgo,
        },
      },
      select: { id: true, pseudo: true },
    });

    // Supprimer les conversations des anonymes
    let conversationsDeleted = 0;
    for (const user of anonymousUsersGoingOffline) {
      try {
        const count = await deleteConversationsForQuickAccessUser(user.id);
        conversationsDeleted += count;
        console.log(`[CLEANUP] Conversations supprimées pour ${user.pseudo}: ${count}`);
      } catch (error) {
        console.error(`[CLEANUP] Erreur suppression conversations pour ${user.pseudo}:`, error);
      }
    }

    // Mettre à jour tous les utilisateurs en ligne dont lastSeenAt est ancien
    const result = await prisma.user.updateMany({
      where: {
        isOnline: true,
        lastSeenAt: {
          lt: fiveMinutesAgo,
        },
      },
      data: {
        isOnline: false,
      },
    });

    console.log(`[CLEANUP] ${result.count} utilisateur(s) marqué(s) comme hors ligne, ${conversationsDeleted} conversation(s) supprimée(s)`);

    return NextResponse.json({
      success: true,
      count: result.count,
      conversationsDeleted,
      anonymousUsersProcessed: anonymousUsersGoingOffline.length,
      message: `${result.count} utilisateur(s) marqué(s) comme hors ligne, ${conversationsDeleted} conversation(s) supprimée(s)`,
    });
  } catch (error) {
    console.error("Erreur nettoyage utilisateurs inactifs:", error);
    return NextResponse.json(
      { error: "Erreur lors du nettoyage" },
      { status: 500 }
    );
  }
}
