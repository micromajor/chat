const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTokens() {
  try {
    console.log('🔍 Vérification des tokens...\n');

    // Lister tous les tokens de vérification
    const tokens = await prisma.verificationToken.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    console.log(`📧 Tokens trouvés: ${tokens.length}\n`);

    tokens.forEach((token, index) => {
      const now = new Date();
      const isExpired = token.expiresAt < now;
      const hoursUntilExpiry = (token.expiresAt - now) / (1000 * 60 * 60);

      console.log(`Token ${index + 1}:`);
      console.log(`  Email: ${token.email}`);
      console.log(`  Token: ${token.token.substring(0, 20)}...`);
      console.log(`  Créé: ${token.createdAt.toLocaleString('fr-FR')}`);
      console.log(`  Expire: ${token.expiresAt.toLocaleString('fr-FR')}`);
      console.log(`  Statut: ${isExpired ? '❌ Expiré' : `✅ Valide (${hoursUntilExpiry.toFixed(1)}h restantes)`}`);
      console.log('');
    });

    // Lister les utilisateurs non vérifiés
    const unverifiedUsers = await prisma.user.findMany({
      where: { isVerified: false },
      select: {
        email: true,
        pseudo: true,
        createdAt: true,
      },
    });

    console.log(`👤 Utilisateurs non vérifiés: ${unverifiedUsers.length}\n`);

    unverifiedUsers.forEach((user, index) => {
      console.log(`Utilisateur ${index + 1}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Pseudo: ${user.pseudo}`);
      console.log(`  Créé: ${user.createdAt.toLocaleString('fr-FR')}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTokens();
