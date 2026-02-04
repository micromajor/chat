import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/quick-access";

// GET - Récupérer les conversations
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    
    if (error) return error;
    const userId = user!.id;

    // Récupérer les utilisateurs bloqués
    const blocks = await prisma.block.findMany({
      where: {
        OR: [
          { blockerId: userId },
          { blockedId: userId },
        ],
      },
    });

    const blockedIds = new Set<string>();
    blocks.forEach((b) => {
      blockedIds.add(b.blockerId);
      blockedIds.add(b.blockedId);
    });
    blockedIds.delete(userId);

    // Récupérer les conversations
    const participations = await prisma.conversationParticipant.findMany({
      where: {
        userId: userId,
        isArchived: false,
      },
      include: {
        conversation: {
          include: {
            participants: {
              where: {
                userId: { not: userId },
              },
              include: {
                user: {
                  select: {
                    id: true,
                    pseudo: true,
                    avatar: true,
                    isOnline: true,
                    lastSeenAt: true,
                  },
                },
              },
            },
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        conversation: {
          updatedAt: "desc",
        },
      },
    });

    // Filtrer les conversations avec des utilisateurs bloqués
    const conversations = participations
      .filter((p) => {
        const otherUser = p.conversation.participants[0]?.user;
        return otherUser && !blockedIds.has(otherUser.id);
      })
      .map((p) => {
        const otherUser = p.conversation.participants[0]?.user;
        const lastMessage = p.conversation.messages[0];

        return {
          id: p.conversation.id,
          user: otherUser,
          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                isRead: lastMessage.isRead,
                isMine: lastMessage.senderId === userId,
              }
            : null,
          updatedAt: p.conversation.updatedAt,
        };
      });

    // Compter les messages non lus pour chaque conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            receiverId: userId,
            isRead: false,
          },
        });
        return { ...conv, unreadCount };
      })
    );

    return NextResponse.json({
      success: true,
      data: conversationsWithUnread,
    });
  } catch (error) {
    console.error("Erreur récupération conversations:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// POST - Créer ou récupérer une conversation avec un utilisateur
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    
    if (error) return error;
    const currentUserId = user!.id;

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    if (userId === currentUserId) {
      return NextResponse.json(
        { success: false, error: "Vous ne pouvez pas vous envoyer de message" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe et n'est pas bloqué
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier le blocage
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: currentUserId, blockedId: userId },
          { blockerId: userId, blockedId: currentUserId },
        ],
      },
    });

    if (block) {
      return NextResponse.json(
        { success: false, error: "Impossible de contacter cet utilisateur" },
        { status: 403 }
      );
    }

    // Chercher une conversation existante
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: currentUserId } } },
          { participants: { some: { userId } } },
        ],
      },
    });

    if (existingConversation) {
      return NextResponse.json({
        success: true,
        data: { conversationId: existingConversation.id },
      });
    }

    // Créer une nouvelle conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: currentUserId },
            { userId },
          ],
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: { conversationId: conversation.id },
    });
  } catch (error) {
    console.error("Erreur création conversation:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
