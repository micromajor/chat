import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Données invalides",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, pseudo, birthDate } = validationResult.data;

    // Vérifier si l'email existe déjà
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Vérifier si le pseudo existe déjà
    const existingPseudo = await prisma.user.findUnique({
      where: { pseudo },
    });

    if (existingPseudo) {
      return NextResponse.json(
        { success: false, error: "Ce pseudo est déjà pris" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        pseudo,
        birthDate: new Date(birthDate),
      },
    });

    // Créer le token de vérification
    const verificationToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    await prisma.verificationToken.create({
      data: {
        email,
        token: verificationToken,
        expiresAt,
      },
    });

    // Envoyer l'email de vérification
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
      // On continue même si l'email échoue
    }

    return NextResponse.json(
      {
        success: true,
        message: "Compte créé avec succès. Vérifiez votre email pour l'activer.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur inscription:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    );
  }
}
