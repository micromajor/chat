// Script pour nettoyer la base de données des faux utilisateurs
// Exécuter avec: npx ts-node scripts/clean-db.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Nettoyage de la base de données...\n');

  // Compter les utilisateurs avant
  const countBefore = await prisma.user.count();
  console.log(`📊 Utilisateurs avant nettoyage: ${countBefore}`);

  // Supprimer toutes les données liées aux utilisateurs d'abord
  console.log('\n🗑️ Suppression des données liées...');
  
  // Messages
  const deletedMessages = await prisma.message.deleteMany({});
  console.log(`  - Messages supprimés: ${deletedMessages.count}`);

  // Conversations participants
  const deletedParticipants = await prisma.conversationParticipant.deleteMany({});
  console.log(`  - Participants conversations: ${deletedParticipants.count}`);

  // Conversations
  const deletedConversations = await prisma.conversation.deleteMany({});
  console.log(`  - Conversations: ${deletedConversations.count}`);

  // Likes
  const deletedLikes = await prisma.like.deleteMany({});
  console.log(`  - Likes: ${deletedLikes.count}`);

  // Blocks
  const deletedBlocks = await prisma.block.deleteMany({});
  console.log(`  - Blocs: ${deletedBlocks.count}`);

  // Reports
  const deletedReports = await prisma.report.deleteMany({});
  console.log(`  - Signalements: ${deletedReports.count}`);

  // Notifications
  const deletedNotifications = await prisma.notification.deleteMany({});
  console.log(`  - Notifications: ${deletedNotifications.count}`);

  // ProfileViews
  const deletedViews = await prisma.profileView.deleteMany({});
  console.log(`  - Vues profil: ${deletedViews.count}`);

  // Verification tokens
  const deletedTokens = await prisma.verificationToken.deleteMany({});
  console.log(`  - Tokens vérification: ${deletedTokens.count}`);

  // Supprimer tous les utilisateurs
  console.log('\n🗑️ Suppression des utilisateurs...');
  const deletedUsers = await prisma.user.deleteMany({});
  console.log(`  - Utilisateurs supprimés: ${deletedUsers.count}`);

  // Vérifier
  const countAfter = await prisma.user.count();
  console.log(`\n✅ Base nettoyée! Utilisateurs restants: ${countAfter}`);
}

cleanDatabase()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
