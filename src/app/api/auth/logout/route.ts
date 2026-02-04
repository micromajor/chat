/**
 * API Route pour gérer la déconnexion et la suppression des messages
 * POST /api/auth/logout
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserFromRequest } from "@/lib/quick-access";
import { setMessagesExpirationForUser } from "@/lib/message-cleanup";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification (NextAuth ou Quick Access)
    const session = await getServerSession(authOptions);
    const quickAccessUser = await getUserFromRequest(request);
    
    const user = session?.user || quickAccessUser;
    
    if (!user?.id) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }
    
    // Mettre à jour le statut de l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isOnline: false,
        lastSeenAt: new Date(),
      },
    });
    
    // Définir l'expiration des messages selon le type d'utilisateur
    await setMessagesExpirationForUser(user.id);
    
    return NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return NextResponse.json(
      { error: "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
}
