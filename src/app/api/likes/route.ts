import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/quick-access";

// Calculer l'âge à partir de la date de naissance
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// GET - Récupérer les likes envoyés (favoris)
export async function GET(request: NextRequest) {
  try {
    // Support dual auth: NextAuth + Quick Access
    const session = await getServerSession(authOptions);
    const quickUser = !session?.user ? await getUserFromRequest(request) : null;
    const currentUser = session?.user || quickUser;

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer les likes envoyés avec les infos du destinataire
    const sentLikes = await prisma.like.findMany({
      where: { senderId: currentUser.id },
      include: {
        receiver: {
          select: {
            id: true,
            pseudo: true,
            avatar: true,
            birthDate: true,
            department: true,
            isOnline: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Formater la réponse
    const formattedLikes = sentLikes.map((like) => ({
      id: like.id,
      createdAt: like.createdAt.toISOString(),
      user: {
        id: like.receiver.id,
        pseudo: like.receiver.pseudo,
        avatar: like.receiver.avatar,
        age: calculateAge(like.receiver.birthDate),
        department: like.receiver.department,
        isOnline: like.receiver.isOnline,
      },
    }));

    return NextResponse.json({
      success: true,
      data: { likes: formattedLikes, total: formattedLikes.length },
    });
  } catch (error) {
    console.error("Erreur récupération likes:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// POST - Liker un utilisateur
export async function POST(request: NextRequest) {
  try {
    // Support dual auth: NextAuth + Quick Access
    const session = await getServerSession(authOptions);
    const quickUser = !session?.user ? await getUserFromRequest(request) : null;
    const currentUser = session?.user || quickUser;

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Les utilisateurs quick access ne peuvent pas liker
    if (quickUser) {
      return NextResponse.json(
        { success: false, error: "Les utilisateurs anonymes ne peuvent pas liker" },
        { status: 403 }
      );
    }

    // Accepter userId, targetUserId ou targetId
    const body = await request.json();
    const userId = body.userId || body.targetUserId || body.targetId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    if (userId === currentUser.id) {
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

    // On ne peut liker que des utilisateurs inscrits (pas quick access)
    if (targetUser.isQuickAccess) {
      return NextResponse.json(
        { success: false, error: "Vous ne pouvez liker que des membres inscrits" },
        { status: 400 }
      );
    }

    // Vérifier si déjà liké
    const existingLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: currentUser.id,
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
        senderId: currentUser.id,
        receiverId: userId,
      },
    });

    // Vérifier si c'est un match (l'autre a aussi liké)
    const mutualLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: currentUser.id,
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
            content: `Vous et ${currentUser.pseudo} vous êtes mutuellement likés !`,
            data: { userId: currentUser.id },
          },
          {
            userId: currentUser.id,
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
          content: `${currentUser.pseudo} vous a liké`,
          data: { userId: currentUser.id },
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
    // Support dual auth: NextAuth + Quick Access
    const session = await getServerSession(authOptions);
    const quickUser = !session?.user ? await getUserFromRequest(request) : null;
    const currentUser = session?.user || quickUser;

    if (!currentUser) {
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
          senderId: currentUser.id,
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
