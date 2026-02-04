import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { reportSchema } from "@/lib/validations";

// POST - Signaler un utilisateur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = reportSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Données invalides" },
        { status: 400 }
      );
    }

    const { reportedId, reason, description } = validation.data;

    if (reportedId === session.user.id) {
      return NextResponse.json(
        { success: false, error: "Vous ne pouvez pas vous signaler vous-même" },
        { status: 400 }
      );
    }

    // Vérifier si un signalement récent existe déjà
    const existingReport = await prisma.report.findFirst({
      where: {
        reporterId: session.user.id,
        reportedId,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24h
        },
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { success: false, error: "Vous avez déjà signalé cet utilisateur récemment" },
        { status: 400 }
      );
    }

    // Créer le signalement
    await prisma.report.create({
      data: {
        reporterId: session.user.id,
        reportedId,
        reason,
        description,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Signalement enregistré. Merci pour votre vigilance.",
    });
  } catch (error) {
    console.error("Erreur signalement:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
