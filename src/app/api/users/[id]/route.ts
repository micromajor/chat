import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/quick-access";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user: currentUser, error } = await requireAuth(request);
    
    if (error) return error;

    const { id } = await params;

    // Vérifier si l'utilisateur est bloqué
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: currentUser!.id, blockedId: id },
          { blockerId: id, blockedId: currentUser!.id },
        ],
      },
    });

    if (block) {
      return NextResponse.json(
        { success: false, error: "Ce profil n'est pas accessible" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        pseudo: true,
        avatar: true,
        birthDate: true,
        country: true,
        department: true,
        description: true,
        isOnline: true,
        isVerified: true,
        isQuickAccess: true,
        lastSeenAt: true,
        createdAt: true,
      },
    });

    if (!user || user.id === currentUser!.id) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Calculer l'âge
    const today = new Date();
    const birthDate = new Date(user.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Vérifier si l'utilisateur actuel a liké ce profil
    const myLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: currentUser!.id,
          receiverId: id,
        },
      },
    });

    // Vérifier si ce profil a liké l'utilisateur actuel
    const theirLike = await prisma.like.findUnique({
      where: {
        senderId_receiverId: {
          senderId: id,
          receiverId: currentUser!.id,
        },
      },
    });

    // Enregistrer la vue du profil (si pas déjà vue récemment)
    const recentView = await prisma.profileView.findFirst({
      where: {
        viewerId: currentUser!.id,
        viewedId: id,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24h
        },
      },
    });

    if (!recentView) {
      await prisma.profileView.create({
        data: {
          viewerId: currentUser!.id,
          viewedId: id,
        },
      });

      // Créer une notification
      await prisma.notification.create({
        data: {
          userId: id,
          type: "PROFILE_VIEW",
          title: "Nouveau visiteur",
          content: `${currentUser!.pseudo} a visité votre profil`,
          data: { userId: currentUser!.id },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        age,
        birthDate: undefined,
        iLiked: !!myLike,
        hasLikedMe: !!theirLike,
        isMatch: !!myLike && !!theirLike,
      },
    });
  } catch (error) {
    console.error("Erreur récupération profil:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
