import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/quick-access";
import prisma from "@/lib/prisma";

// GET - Récupérer les messages d'une conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth(request);
    
    if (error) return error;
    const userId = user!.id;

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Vérifier que l'utilisateur fait partie de la conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId: userId,
          conversationId: id,
        },
      },
      include: {
        conversation: {
          include: {
            participants: {
              where: { userId: { not: userId } },
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
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, error: "Conversation non trouvée" },
        { status: 404 }
      );
    }

    // Récupérer les messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId: id,
        isDeleted: false,
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });

    const hasMore = messages.length > limit;
    if (hasMore) messages.pop();

    // Marquer les messages comme lus
    await prisma.message.updateMany({
      where: {
        conversationId: id,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    // Mettre à jour lastReadAt
    await prisma.conversationParticipant.update({
      where: {
        userId_conversationId: {
          userId: userId,
          conversationId: id,
        },
      },
      data: { lastReadAt: new Date() },
    });

    const otherUser = participant.conversation.participants[0]?.user;

    return NextResponse.json({
      success: true,
      data: {
        messages: messages.reverse(),
        otherUser,
        hasMore,
        nextCursor: hasMore ? messages[0]?.id : null,
      },
    });
  } catch (error) {
    console.error("Erreur récupération messages:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// POST - Envoyer un message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth(request);
    
    if (error) return error;
    const userId = user!.id;

    const { id } = await params;
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Message vide" },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Message trop long (max 2000 caractères)" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur fait partie de la conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId: userId,
          conversationId: id,
        },
      },
      include: {
        conversation: {
          include: {
            participants: {
              where: { userId: { not: userId } },
            },
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, error: "Conversation non trouvée" },
        { status: 404 }
      );
    }

    const receiverId = participant.conversation.participants[0]?.userId;

    if (!receiverId) {
      return NextResponse.json(
        { success: false, error: "Destinataire non trouvé" },
        { status: 400 }
      );
    }

    // Vérifier le blocage
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedId: receiverId },
          { blockerId: receiverId, blockedId: userId },
        ],
      },
    });

    if (block) {
      return NextResponse.json(
        { success: false, error: "Impossible d'envoyer ce message" },
        { status: 403 }
      );
    }

    // Créer le message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: userId,
        receiverId,
        conversationId: id,
      },
    });

    // Mettre à jour la conversation
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    // Créer une notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "NEW_MESSAGE",
        title: "Nouveau message",
        content: `${user!.pseudo} vous a envoyé un message`,
        data: { conversationId: id, senderId: userId },
      },
    });

    return NextResponse.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error("Erreur envoi message:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer/Archiver une conversation pour l'utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error } = await requireAuth(request);
    
    if (error) return error;
    const userId = user!.id;

    const { id } = await params;

    // Vérifier que l'utilisateur fait partie de la conversation
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        userId_conversationId: {
          userId: userId,
          conversationId: id,
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, error: "Conversation non trouvée" },
        { status: 404 }
      );
    }

    // Archiver la conversation pour cet utilisateur (ne pas supprimer pour l'autre)
    await prisma.conversationParticipant.update({
      where: {
        userId_conversationId: {
          userId: userId,
          conversationId: id,
        },
      },
      data: { isArchived: true },
    });

    return NextResponse.json({
      success: true,
      message: "Conversation supprimée",
    });
  } catch (error) {
    console.error("Erreur suppression conversation:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
