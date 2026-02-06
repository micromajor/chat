/**
 * API Route pour mettre à jour le lastSeenAt de l'utilisateur
 * POST /api/auth/heartbeat
 * 
 * Appelée régulièrement (toutes les 2 minutes) pour maintenir le statut "en ligne"
 * Passe aussi les utilisateurs inactifs > 5min en offline
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/quick-access";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    
    if (error) return error;

    // Mettre à jour lastSeenAt
    await prisma.user.update({
      where: { id: user!.id },
      data: {
        isOnline: true,
        lastSeenAt: new Date(),
      },
    });

    // Passer les utilisateurs inactifs > 5 min en offline (en arrière-plan)
    // Exclure les fakes (@menhir.test) qui sont gérés par le cron
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    prisma.user.updateMany({
      where: {
        isOnline: true,
        lastSeenAt: { lt: fiveMinutesAgo },
        id: { not: user!.id }, // Pas l'utilisateur courant
        email: { not: { contains: "@menhir.test" } } // Exclure les fakes
      },
      data: { isOnline: false }
    }).catch(err => console.error("Erreur cleanup inactifs:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur heartbeat:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
