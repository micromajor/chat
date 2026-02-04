import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pseudo = searchParams.get("pseudo");

    if (!pseudo) {
      return NextResponse.json(
        { error: "Pseudo requis" },
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

    return NextResponse.json({
      available: !existingUser,
      pseudo,
    });
  } catch (error) {
    console.error("Erreur vérification pseudo:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
