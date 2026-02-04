import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validations";

// GET - Récupérer le profil de l'utilisateur connecté
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
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
        avatar: true,
        birthDate: true,
        city: true,
        region: true,
        description: true,
        searchAgeMin: true,
        searchAgeMax: true,
        searchDistance: true,
        isOnline: true,
        isInvisible: true,
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

    // Calculer l'âge
    const today = new Date();
    const birthDate = new Date(user.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        age,
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

// PUT - Mettre à jour le profil
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = profileUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Données invalides",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Vérifier si le pseudo est déjà pris (si modifié)
    if (data.pseudo) {
      const existingUser = await prisma.user.findFirst({
        where: {
          pseudo: data.pseudo,
          id: { not: session.user.id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "Ce pseudo est déjà pris" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        pseudo: true,
        city: true,
        region: true,
        description: true,
        searchAgeMin: true,
        searchAgeMax: true,
        searchDistance: true,
        isInvisible: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer le compte
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Supprimer l'utilisateur (cascade supprimera les données liées)
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({
      success: true,
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression compte:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
