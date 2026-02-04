import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/quick-access";

// GET - Récupérer le nombre total de messages non lus
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    
    if (error) return error;
    const userId = user!.id;

    // Récupérer les utilisateurs bloqués pour les exclure
    const blocks = await prisma.block.findMany({
      where: {
        OR: [
          { blockerId: userId },
          { blockedId: userId },
        ],
      },
      select: {
        blockerId: true,
        blockedId: true,
      },
    });

    const blockedIds = new Set<string>();
    blocks.forEach((b) => {
      blockedIds.add(b.blockerId);
      blockedIds.add(b.blockedId);
    });
    blockedIds.delete(userId);

    // Compter les messages non lus (excluant les utilisateurs bloqués)
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
        isDeleted: false,
        // Exclure les messages des utilisateurs bloqués
        senderId: {
          notIn: Array.from(blockedIds),
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    console.error("Erreur récupération messages non lus:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
