/**
 * Script pour nettoyer les utilisateurs online fantômes
 * Passe offline tous les utilisateurs dont lastSeenAt > 5 minutes
 * Usage: npx tsx scripts/cleanup-online-ghost.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  // Trouver les fantômes
  const ghosts = await prisma.user.findMany({
    where: {
      isOnline: true,
      lastSeenAt: {
        lt: fiveMinutesAgo
      }
    },
    select: {
      id: true,
      pseudo: true,
      lastSeenAt: true,
    }
  });

  console.log(`=== Utilisateurs fantômes (online mais inactifs > 5min) ===\n`);
  console.log(`Trouvés: ${ghosts.length}\n`);

  if (ghosts.length === 0) {
    console.log("Aucun fantôme à nettoyer !");
    await prisma.$disconnect();
    return;
  }

  for (const ghost of ghosts) {
    const lastSeen = new Date(ghost.lastSeenAt);
    const agoMinutes = Math.round((Date.now() - lastSeen.getTime()) / 60000);
    console.log(`- ${ghost.pseudo} | last seen: ${agoMinutes} min ago`);
  }

  // Les passer offline
  const result = await prisma.user.updateMany({
    where: {
      id: { in: ghosts.map(g => g.id) }
    },
    data: {
      isOnline: false
    }
  });

  console.log(`\n✅ ${result.count} utilisateurs passés offline`);

  await prisma.$disconnect();
}

main().catch(console.error);
