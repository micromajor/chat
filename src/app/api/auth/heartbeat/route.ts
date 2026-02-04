/**
 * API Route pour mettre à jour le lastSeenAt de l'utilisateur
 * POST /api/auth/heartbeat
 * 
 * Appelée régulièrement (toutes les 2 minutes) pour maintenir le statut "en ligne"
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur heartbeat:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
