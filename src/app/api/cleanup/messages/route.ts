/**
 * API Route pour le nettoyage automatique des messages expirés
 * À appeler via un cron job (ex: toutes les 5 minutes)
 * 
 * Utilisation avec cron:
 * Chaque 5 minutes : curl http://localhost:3000/api/cleanup/messages
 * 
 * Ou avec Vercel Cron Jobs (vercel.json):
 * Configuration dans vercel.json pour automatiser
 */

import { NextResponse } from "next/server";
import { cleanupExpiredMessages } from "@/lib/message-cleanup";

export async function POST() {
  try {
    const deletedCount = await cleanupExpiredMessages();
    
    return NextResponse.json({
      success: true,
      deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur lors du nettoyage des messages:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Erreur lors du nettoyage des messages" 
      },
      { status: 500 }
    );
  }
}

// Alternative GET pour les cron jobs qui ne supportent pas POST
export async function GET() {
  return POST();
}
