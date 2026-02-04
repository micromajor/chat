/**
 * API Route pour nettoyer les utilisateurs inactifs
 * GET /api/cron/cleanup-inactive
 * 
 * Marque comme "hors ligne" les utilisateurs dont lastSeenAt > 5 minutes
 * À appeler régulièrement (cron Vercel ou appel client)
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    console.log(`[CLEANUP] ${result.count} utilisateur(s) marqué(s) comme hors ligne`);

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} utilisateur(s) marqué(s) comme hors ligne`,
    });
  } catch (error) {
    console.error("Erreur nettoyage utilisateurs inactifs:", error);
    return NextResponse.json(
      { error: "Erreur lors du nettoyage" },
      { status: 500 }
    );
  }
}
