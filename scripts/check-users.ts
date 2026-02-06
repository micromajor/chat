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
      isOnline: true,
      lastSeenAt: true,
      createdAt: true,
    },
    orderBy: {
      lastSeenAt: "desc"
    },
    take: 30
  });

  console.log("=== Utilisateurs avec pseudo Menhir_* ===\n");
  console.log("Total:", menhirUsers.length);
  console.log("\nDétails:");
  
  for (const user of menhirUsers) {
    const lastSeen = new Date(user.lastSeenAt);
    const agoMinutes = Math.round((Date.now() - lastSeen.getTime()) / 60000);
    const status = user.isOnline ? "🟢 ONLINE" : "⚫ offline";
    console.log(`- ${user.pseudo} | ${status} | last seen: ${agoMinutes} min ago | created: ${user.createdAt.toISOString().split('T')[0]}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
