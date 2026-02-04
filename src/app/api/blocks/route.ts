import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { reportSchema } from "@/lib/validations";

// POST - Bloquer un utilisateur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { userId, reason } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "ID utilisateur requis" },
        { status: 400 }
      );
    }

    if (userId === session.user.id) {
      return NextResponse.json(
        { success: false, error: "Vous ne pouvez pas vous bloquer vous-même" },
        { status: 400 }
      );
    }

    // Vérifier si déjà bloqué
    const existingBlock = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: session.user.id,
          blockedId: userId,
        },
      },
    });

    if (existingBlock) {
      return NextResponse.json(
        { success: false, error: "Utilisateur déjà bloqué" },
        { status: 400 }
      );
    }

    // Créer le blocage
    await prisma.block.create({
      data: {
        blockerId: session.user.id,
        blockedId: userId,
        reason,
      },
    });

    // Supprimer les likes mutuels
    await prisma.like.deleteMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: userId },
          { senderId: userId, receiverId: session.user.id },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Utilisateur bloqué",
    });
  } catch (error) {
    console.error("Erreur blocage:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// DELETE - Débloquer un utilisateur
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

    await prisma.block.delete({
      where: {
        blockerId_blockedId: {
          blockerId: session.user.id,
          blockedId: userId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Utilisateur débloqué",
    });
  } catch (error) {
    console.error("Erreur déblocage:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// GET - Liste des utilisateurs bloqués
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const blocks = await prisma.block.findMany({
      where: { blockerId: session.user.id },
      include: {
        blocked: {
          select: {
            id: true,
            pseudo: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: blocks.map((b) => ({
        id: b.id,
        user: b.blocked,
        createdAt: b.createdAt,
      })),
    });
  } catch (error) {
    console.error("Erreur liste blocages:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
