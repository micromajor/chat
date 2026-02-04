import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";

// GET - Obtenir les informations du compte utilisateur
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        pseudo: true,
        birthDate: true,
        department: true,
        description: true,
        avatar: true,
        isOnline: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Erreur GET /api/account:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour le mot de passe
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Mots de passe requis" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Le nouveau mot de passe doit faire au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Vérifier le mot de passe actuel
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const isValid = await compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Mot de passe actuel incorrect" },
        { status: 400 }
      );
    }

    // Hasher et mettre à jour le nouveau mot de passe
    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur PUT /api/account:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer le compte utilisateur
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Supprimer toutes les données liées à l'utilisateur
    await prisma.$transaction([
      // Supprimer les messages envoyés
      prisma.message.deleteMany({
        where: { senderId: session.user.id },
      }),
      // Supprimer les messages reçus
      prisma.message.deleteMany({
        where: { receiverId: session.user.id },
      }),
      // Supprimer les conversations
      prisma.conversationParticipant.deleteMany({
        where: { userId: session.user.id },
      }),
      // Supprimer les likes envoyés
      prisma.like.deleteMany({
        where: { senderId: session.user.id },
      }),
      // Supprimer les likes reçus
      prisma.like.deleteMany({
        where: { receiverId: session.user.id },
      }),
      // Supprimer les blocages
      prisma.block.deleteMany({
        where: {
          OR: [
            { blockerId: session.user.id },
            { blockedId: session.user.id },
          ],
        },
      }),
      // Supprimer les signalements
      prisma.report.deleteMany({
        where: {
          OR: [
            { reporterId: session.user.id },
            { reportedId: session.user.id },
          ],
        },
      }),
      // Supprimer les vues de profil
      prisma.profileView.deleteMany({
        where: {
          OR: [
            { viewerId: session.user.id },
            { viewedId: session.user.id },
          ],
        },
      }),
      // Supprimer les notifications
      prisma.notification.deleteMany({
        where: { userId: session.user.id },
      }),
      // Enfin, supprimer l'utilisateur
      prisma.user.delete({
        where: { id: session.user.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur DELETE /api/account:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
