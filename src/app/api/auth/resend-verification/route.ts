import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { pseudo } = await request.json();

    if (!pseudo) {
      return NextResponse.json(
        { error: "Pseudo requis" },
        { status: 400 }
      );
    }

    // Trouver l'utilisateur par pseudo
    const user = await prisma.user.findUnique({
      where: { pseudo },
      select: { id: true, email: true, isVerified: true, isQuickAccess: true },
    });

    if (!user) {
      // Message générique pour la sécurité (ne pas révéler si le pseudo existe)
      return NextResponse.json(
        { success: true, message: "Si ce compte existe, un email a été envoyé." },
        { status: 200 }
      );
    }

    // Vérifier que ce n'est pas un accès rapide
    if (user.isQuickAccess) {
      return NextResponse.json(
        { error: "Les comptes accès rapide n'ont pas d'email" },
        { status: 400 }
      );
    }

    // Déjà vérifié ?
    if (user.isVerified) {
      return NextResponse.json(
        { error: "Ce compte est déjà vérifié" },
        { status: 400 }
      );
    }

    // Supprimer les anciens tokens de vérification pour cet email
    await prisma.verificationToken.deleteMany({
      where: { email: user.email },
    });

    // Créer un nouveau token de vérification
    const verificationToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    await prisma.verificationToken.create({
      data: {
        email: user.email,
        token: verificationToken,
        expiresAt,
      },
    });

    // Envoyer l'email de vérification
    try {
      await sendVerificationEmail(user.email, verificationToken);
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email de vérification envoyé",
    });
  } catch (error) {
    console.error("Erreur resend-verification:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
