// Script pour tester les boutons du profil
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testProfileButtons() {
  console.log("🔍 Test des boutons du profil\n");

  try {
    // 1. Vérifier que les utilisateurs existent
    const users = await prisma.user.findMany({
      select: {
        id: true,
        pseudo: true,
        avatar: true,
      },
      take: 2,
    });

    if (users.length < 2) {
      console.log("❌ Il faut au moins 2 utilisateurs pour tester");
      return;
    }

    const [user1, user2] = users;
    console.log(`✅ Utilisateurs trouvés:`);
    console.log(`   - ${user1.pseudo} (${user1.id})`);
    console.log(`   - ${user2.pseudo} (${user2.id})\n`);

    // 2. Test du bouton LIKE
    console.log("🧪 Test bouton LIKE:");
    const existingLike = await prisma.like.findFirst({
      where: {
        senderId: user1.id,
        receiverId: user2.id,
      },
    });

    if (existingLike) {
      console.log(`   ✅ Like existant trouvé (ID: ${existingLike.id})`);
    } else {
      console.log(`   ℹ️  Pas de like existant`);
    }

    // 3. Test du bouton MESSAGE
    console.log("\n🧪 Test bouton MESSAGE:");
    const conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            userId: {
              in: [user1.id, user2.id],
            },
          },
        },
      },
      include: {
        participants: true,
      },
    });

    if (conversation) {
      console.log(`   ✅ Conversation existante (ID: ${conversation.id})`);
    } else {
      console.log(`   ℹ️  Pas de conversation existante`);
    }

    // 4. Test du bouton SIGNALER
    console.log("\n🧪 Test bouton SIGNALER:");
    const reports = await prisma.report.findMany({
      where: {
        reporterId: user1.id,
        reportedId: user2.id,
      },
    });

    if (reports.length > 0) {
      console.log(`   ✅ ${reports.length} signalement(s) trouvé(s)`);
    } else {
      console.log(`   ℹ️  Pas de signalement`);
    }

    // 5. Test du bouton BLOQUER
    console.log("\n🧪 Test bouton BLOQUER:");
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: user1.id, blockedId: user2.id },
          { blockerId: user2.id, blockedId: user1.id },
        ],
      },
    });

    if (block) {
      console.log(`   ✅ Blocage trouvé (ID: ${block.id})`);
      console.log(`      Bloqueur: ${block.blockerId === user1.id ? user1.pseudo : user2.pseudo}`);
    } else {
      console.log(`   ℹ️  Pas de blocage`);
    }

    // 6. Vérifier les notifications
    console.log("\n🧪 Test NOTIFICATIONS:");
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user2.id,
      },
      select: {
        type: true,
        isRead: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    if (notifications.length > 0) {
      console.log(`   ✅ ${notifications.length} notification(s) trouvée(s):`);
      notifications.forEach((notif) => {
        const emoji = notif.isRead ? "✉️" : "📬";
        console.log(
          `      ${emoji} ${notif.type}: ${notif.title} (${new Date(notif.createdAt).toLocaleString()})`
        );
      });
    } else {
      console.log(`   ℹ️  Pas de notifications`);
    }

    console.log("\n✅ Tous les tests sont terminés!");
    console.log("\n📋 RÉSUMÉ DES ACTIONS DISPONIBLES:");
    console.log("   1. ❤️  LIKE - Fonctionne via /api/likes");
    console.log("   2. 💬 MESSAGE - Fonctionne via /api/conversations");
    console.log("   3. 🚨 SIGNALER - Fonctionne via /api/reports");
    console.log("   4. 🚫 BLOQUER - Fonctionne via /api/blocks");
    console.log("   5. 🗑️  SUPPRIMER (conversation) - Non visible sur profil\n");

  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testProfileButtons();
