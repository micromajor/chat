/**
 * Script pour vérifier des utilisateurs spécifiques
 * Usage: npx tsx scripts/check-users.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Vérifier les utilisateurs Menhir_*
  const menhirUsers = await prisma.user.findMany({
    where: {
      pseudo: {
        startsWith: "Menhir"
      }
    },
    select: {
      pseudo: true,
      email: true,
      isQuickAccess: true,
      isFakeProfile: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 30
  });

  console.log("=== Utilisateurs avec pseudo Menhir_* ===\n");
  console.log("Total:", menhirUsers.length);
  console.log("\nDétails:");
  
  for (const user of menhirUsers) {
    const type = user.isFakeProfile ? "FAKE" : (user.isQuickAccess ? "ACCÈS RAPIDE" : "INSCRIT");
    console.log(`- ${user.pseudo} | ${type} | créé: ${user.createdAt.toISOString().split('T')[0]}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
