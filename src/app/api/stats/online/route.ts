/**
 * API Route pour récupérer le nombre d'utilisateurs connectés
 * GET /api/stats/online
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Compter les utilisateurs en ligne (connectés dans les 5 dernières minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const onlineCount = await prisma.user.count({
      where: {
        isOnline: true,
        lastSeenAt: {
          gte: fiveMinutesAgo,
        },
        isBanned: false,
      },
    });
    
    return NextResponse.json({
      count: onlineCount,
      showCount: onlineCount > 50, // Afficher seulement si > 50
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
