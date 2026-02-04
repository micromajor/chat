import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST - Liker un utilisateur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    if (userId === session.user.id) {
      return NextResponse.json(
        { success: false, error: "Vous ne pouvez pas vous liker vous-même" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si déjà liké
    const existingLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: session.user.id,
          receiverId: userId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { success: false, error: "Vous avez déjà liké cet utilisateur" },
        { status: 400 }
      );
    }

    // Créer le like
    await prisma.like.create({
      data: {
        senderId: session.user.id,
        receiverId: userId,
      },
    });

    // Vérifier si c'est un match (l'autre a aussi liké)
    const mutualLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: session.user.id,
        },
      },
    });

    const isMatch = !!mutualLike;

    // Créer une notification
    if (isMatch) {
      // Notification de match pour les deux
      await prisma.notification.createMany({
        data: [
          {
            userId: userId,
            type: "MATCH",
            title: "Nouveau match ! 🎉",
            content: `Vous et ${session.user.pseudo} vous êtes mutuellement likés !`,
            data: { userId: session.user.id },
          },
          {
            userId: session.user.id,
            type: "MATCH",
            title: "Nouveau match ! 🎉",
            content: `Vous et ${targetUser.pseudo} vous êtes mutuellement likés !`,
            data: { userId: userId },
          },
        ],
      });
    } else {
      // Notification de like simple
      await prisma.notification.create({
        data: {
          userId: userId,
          type: "NEW_LIKE",
          title: "Nouveau like ❤️",
          content: `${session.user.pseudo} vous a liké`,
          data: { userId: session.user.id },
        },
      });
    }

    return NextResponse.json({
      success: true,
      isMatch,
    });
  } catch (error) {
    console.error("Erreur like:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// DELETE - Retirer un like
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    await prisma.like.delete({
      where: {
        senderId_receiverId: {
          senderId: session.user.id,
          receiverId: userId,
        },
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Erreur unlike:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
