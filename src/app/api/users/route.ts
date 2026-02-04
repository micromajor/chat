import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { searchSchema } from "@/lib/validations";
import { requireAuth } from "@/lib/quick-access";

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth(request);
    
    if (error) return error;

    const { searchParams } = new URL(request.url);
    
    const params = {
      ageMin: searchParams.get("ageMin") ? parseInt(searchParams.get("ageMin")!) : undefined,
      ageMax: searchParams.get("ageMax") ? parseInt(searchParams.get("ageMax")!) : undefined,
      country: searchParams.get("country") || undefined,
      department: searchParams.get("department") || undefined,
      search: searchParams.get("search") || undefined,
      isOnline: searchParams.get("isOnline") === "true" ? true : undefined,
      hasPhoto: searchParams.get("hasPhoto") === "true" ? true : undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20,
    };

    const validation = searchSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Paramètres invalides" },
        { status: 400 }
      );
    }

    const { ageMin, ageMax, country, department, search, isOnline, hasPhoto, page, limit } = validation.data;

    // Récupérer les utilisateurs bloqués par ou qui ont bloqué l'utilisateur actuel
    const blocks = await prisma.block.findMany({
      where: {
        OR: [
          { blockerId: user!.id },
          { blockedId: user!.id },
        ],
      },
      select: {
        blockerId: true,
        blockedId: true,
      },
    });

    const blockedUserIds = new Set<string>();
    blocks.forEach((block) => {
      blockedUserIds.add(block.blockerId);
      blockedUserIds.add(block.blockedId);
    });
    blockedUserIds.delete(user!.id);

    // Calculer les dates pour le filtre d'âge
    const today = new Date();
    const maxBirthDate = ageMin
      ? new Date(today.getFullYear() - ageMin, today.getMonth(), today.getDate())
      : undefined;
    const minBirthDate = ageMax
      ? new Date(today.getFullYear() - ageMax - 1, today.getMonth(), today.getDate())
      : undefined;

    // Construire la requête
    const where = {
      id: { 
        not: user!.id,
        notIn: Array.from(blockedUserIds),
      },
      isBanned: false,
      // Les utilisateurs en accès rapide peuvent voir tout le monde
      // isVerified: true, // Commenté pour permettre aux quick access de voir les autres
      isInvisible: false,
      ...(isOnline !== undefined && { isOnline }),
      ...(hasPhoto && { 
        AND: [
          { avatar: { not: null } },
          { avatar: { not: "" } }
        ]
      }),
      ...(country && { country: country }),
      ...(department && { department: department }),
      ...(search && { pseudo: { contains: search, mode: "insensitive" as const } }),
      ...(maxBirthDate && { birthDate: { lte: maxBirthDate } }),
      ...(minBirthDate && { birthDate: { gte: minBirthDate } }),
    };

    // Compter le total
    const total = await prisma.user.count({ where });

    // Récupérer les utilisateurs
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        pseudo: true,
        avatar: true,
        birthDate: true,
        country: true,
        department: true,
        description: true,
        isOnline: true,
        lastSeenAt: true,
        createdAt: true,
      },
      orderBy: [
        { isOnline: "desc" },
        { lastSeenAt: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    // Calculer l'âge pour chaque utilisateur
    const usersWithAge = users.map((user) => {
      const birthDate = new Date(user.birthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return {
        ...user,
        age,
        birthDate: undefined, // Ne pas exposer la date de naissance
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        users: usersWithAge,
        total,
        page,
        limit,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Erreur recherche utilisateurs:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
