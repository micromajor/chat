import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pseudo = formData.get("pseudo") as string;
    const avatarFile = formData.get("avatar") as File | null;

    if (!pseudo || pseudo.length < 3 || pseudo.length > 20) {
      return NextResponse.json(
        { error: "Pseudo invalide (3-20 caractères)" },
        { status: 400 }
      );
    }

    // Vérifier si le pseudo existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        pseudo: {
          equals: pseudo,
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ce pseudo est déjà utilisé" },
        { status: 400 }
      );
    }

    // Générer un token unique pour l'accès rapide
    const quickAccessToken = randomBytes(32).toString("hex");
    
    // Générer un email temporaire unique (pour la contrainte unique)
    const tempEmail = `quick_${randomBytes(8).toString("hex")}@menhir.temp`;
    
    // Générer un mot de passe aléatoire (l'utilisateur devra le définir s'il veut garder le compte)
    const tempPassword = randomBytes(16).toString("hex");

    // Traiter l'avatar si présent
    let avatarUrl: string | null = null;
    if (avatarFile && avatarFile.size > 0) {
      // Pour l'instant, on stocke en base64 (en prod, utiliser Cloudinary/S3)
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      avatarUrl = `data:${avatarFile.type};base64,${buffer.toString("base64")}`;
    }

    // Créer l'utilisateur en accès rapide
    const user = await prisma.user.create({
      data: {
        pseudo,
        email: tempEmail,
        password: tempPassword, // Non hashé car temporaire et inutilisable
        birthDate: new Date("2000-01-01"), // Date par défaut
        avatar: avatarUrl,
        isOnline: true,
        isVerified: false,
        isQuickAccess: true,
        quickAccessToken,
        lastSeenAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      token: quickAccessToken,
      user: {
        id: user.id,
        pseudo: user.pseudo,
        avatar: user.avatar,
        isQuickAccess: true,
      },
    });
  } catch (error) {
    console.error("Erreur inscription rapide:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du profil" },
      { status: 500 }
    );
  }
}
