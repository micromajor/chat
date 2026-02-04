import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = forgotPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Email invalide" },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // On retourne toujours un succès pour éviter de révéler si l'email existe
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Si cet email existe, vous recevrez un lien de réinitialisation.",
      });
    }

    // Supprimer les anciens tokens
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // Créer un nouveau token
    const resetToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await prisma.passwordResetToken.create({
      data: {
        email,
        token: resetToken,
        expiresAt,
      },
    });

    // Envoyer l'email
    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Si cet email existe, vous recevrez un lien de réinitialisation.",
    });
  } catch (error) {
    console.error("Erreur mot de passe oublié:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
