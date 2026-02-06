/**
 * Script pour randomiser le statut en ligne des faux profils
 * À exécuter via cron pour simuler des connexions/déconnexions
 * Usage: npx ts-node scripts/randomize-fake-online.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Randomisation des statuts en ligne...\n");

  // Récupérer tous les faux profils
  const fakeUsers = await prisma.user.findMany({
    where: {
      email: { endsWith: "@menhir.test" }
    },
    select: { id: true, pseudo: true, isOnline: true }
  });

  if (fakeUsers.length === 0) {
    console.log("❌ Aucun faux profil trouvé");
    return;
  }

  let onlineCount = 0;
  let changedCount = 0;

  for (const user of fakeUsers) {
    // 30% de chance d'être en ligne
    const newIsOnline = Math.random() < 0.3;
    
    if (newIsOnline !== user.isOnline) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isOnline: newIsOnline,
          lastSeenAt: newIsOnline ? new Date() : new Date(Date.now() - Math.random() * 3600000)
        }
      });
      changedCount++;
    }
    
    if (newIsOnline) onlineCount++;
  }

  console.log(`✅ Statuts mis à jour !`);
  console.log(`   - ${fakeUsers.length} profils traités`);
  console.log(`   - ${changedCount} changements effectués`);
  console.log(`   - 🟢 ${onlineCount} maintenant en ligne`);
  console.log(`   - ⚫ ${fakeUsers.length - onlineCount} hors ligne`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
