import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token manquant" },
        { status: 400 }
      );
    }

    // Rechercher le token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    // Vérifier l'expiration
    if (verificationToken.expiresAt < new Date()) {
      // Supprimer le token expiré
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });

      return NextResponse.json(
        { success: false, error: "Token expiré. Veuillez vous réinscrire." },
        { status: 400 }
      );
    }

    // Activer le compte
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { isVerified: true },
    });

    // Supprimer le token utilisé
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json({
      success: true,
      message: "Email vérifié avec succès ! Vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    console.error("Erreur vérification:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
