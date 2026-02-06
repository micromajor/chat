/**
 * Script pour randomiser le statut en ligne des faux profils
 * Garantit un minimum de 30 profils en ligne
 * À exécuter via cron toutes les heures
 * Usage: npx tsx scripts/randomize-fake-online.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MIN_ONLINE = 30; // Minimum de profils en ligne

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

  // Mélanger aléatoirement les profils
  const shuffled = fakeUsers.sort(() => Math.random() - 0.5);
  
  // Déterminer combien seront en ligne (minimum 30, max 50% des profils)
  const targetOnline = Math.max(MIN_ONLINE, Math.floor(fakeUsers.length * 0.4 + Math.random() * fakeUsers.length * 0.2));
  const actualOnline = Math.min(targetOnline, fakeUsers.length);

  let changedCount = 0;

  for (let i = 0; i < shuffled.length; i++) {
    const user = shuffled[i];
    const shouldBeOnline = i < actualOnline;
    
    if (shouldBeOnline !== user.isOnline) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isOnline: shouldBeOnline,
          lastSeenAt: shouldBeOnline ? new Date() : new Date(Date.now() - Math.random() * 3600000)
        }
      });
      changedCount++;
    }
  }

  const onlineCount = await prisma.user.count({
    where: {
      email: { endsWith: "@menhir.test" },
      isOnline: true
    }
  });

  console.log(`✅ Statuts mis à jour !`);
  console.log(`   - ${fakeUsers.length} profils traités`);
  console.log(`   - ${changedCount} changements effectués`);
  console.log(`   - 🟢 ${onlineCount} maintenant en ligne (min: ${MIN_ONLINE})`);
  console.log(`   - ⚫ ${fakeUsers.length - onlineCount} hors ligne`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
