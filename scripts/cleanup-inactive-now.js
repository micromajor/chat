/**
 * Script pour nettoyer manuellement les utilisateurs inactifs
 * Marque comme "hors ligne" les utilisateurs dont lastSeenAt > 5 minutes
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupInactiveUsers() {
  try {
    console.log("🧹 Nettoyage des utilisateurs inactifs...\n");
    
    // Date limite : 5 minutes avant maintenant
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    console.log(`Date limite : ${fiveMinutesAgo.toLocaleString()}`);
    console.log("Les utilisateurs vus avant cette date seront marqués comme hors ligne.\n");

    // Trouver d'abord les utilisateurs concernés
    const usersToUpdate = await prisma.user.findMany({
      where: {
        isOnline: true,
        lastSeenAt: {
          lt: fiveMinutesAgo,
        },
      },
      select: {
        pseudo: true,
        lastSeenAt: true,
      },
    });

    if (usersToUpdate.length === 0) {
      console.log("✅ Aucun utilisateur à nettoyer. Tous sont récemment actifs !");
    } else {
      console.log(`📋 ${usersToUpdate.length} utilisateur(s) à nettoyer :\n`);
      usersToUpdate.forEach(u => {
        const minutesAgo = Math.floor((Date.now() - new Date(u.lastSeenAt).getTime()) / 60000);
        console.log(`   - ${u.pseudo} (vu il y a ${minutesAgo} min)`);
      });

      // Mettre à jour
      const result = await prisma.user.updateMany({
        where: {
          isOnline: true,
          lastSeenAt: {
            lt: fiveMinutesAgo,
          },
        },
        data: {
          isOnline: false,
        },
      });

      console.log(`\n✅ ${result.count} utilisateur(s) marqué(s) comme hors ligne`);
    }

    // Afficher le statut final
    const allUsers = await prisma.user.findMany({
      select: {
        pseudo: true,
        isOnline: true,
      },
    });

    const onlineCount = allUsers.filter(u => u.isOnline).length;
    const offlineCount = allUsers.filter(u => !u.isOnline).length;

    console.log(`\n📊 Statut final :`);
    console.log(`   En ligne  : ${onlineCount}`);
    console.log(`   Hors ligne: ${offlineCount}`);
    console.log(`   Total     : ${allUsers.length}`);

  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupInactiveUsers();
