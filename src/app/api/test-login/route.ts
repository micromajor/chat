import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  console.log("[test-login] Requête reçue");
  
  try {
    const body = await request.json();
    const { pseudo, password } = body;
    
    console.log("[test-login] Pseudo:", pseudo);
    
    if (!pseudo || !password) {
      return NextResponse.json({ error: "Pseudo et mot de passe requis" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { 
        pseudo: { 
          equals: pseudo,
          mode: 'insensitive'
        }
      },
    });

    if (!user) {
      console.log("[test-login] Utilisateur non trouvé");
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const isPasswordValid = await compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log("[test-login] Mot de passe invalide");
      return NextResponse.json({ error: "Mot de passe invalide" }, { status: 401 });
    }

    console.log("[test-login] Connexion réussie pour", user.pseudo);
    
    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        pseudo: user.pseudo,
        isVerified: user.isVerified
      } 
    });
    
  } catch (error) {
    console.error("[test-login] Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
