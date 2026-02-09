/**
 * API Route pour récupérer le nombre d'utilisateurs connectés
 * GET /api/stats/online
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Compter les utilisateurs en ligne (flag isOnline = true)
    // Note: les fakes n'ont pas de heartbeat donc on ne filtre plus par lastSeenAt
    const onlineCount = await prisma.user.count({
      where: {
        isOnline: true,
        isBanned: false,
      },
    });
    
    return NextResponse.json({
      count: onlineCount,
      showCount: onlineCount >= 1, // Afficher dès qu'il y a 1 connecté
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre d'utilisateurs en ligne:", error);
    return NextResponse.json(
      { 
        count: 0,
        showCount: false,
        error: "Erreur lors de la récupération des statistiques" 
      },
      { status: 500 }
    );
  }
}
