import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkForgottenPassword() {
  try {
    const email = 'dp1985.webmaster@gmail.com';
    
    console.log('🔍 Recherche de l\'utilisateur...');
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        pseudo: true,
        email: true,
        isVerified: true,
        isQuickAccess: true,
        createdAt: true
      }
    });

    if (!user) {
      console.log('❌ Aucun utilisateur trouvé avec l\'email:', email);
      console.log('L\'utilisateur doit d\'abord s\'inscrire sur le site.');
      return;
    }

    console.log('\n✅ Utilisateur trouvé:');
    console.log(JSON.stringify(user, null, 2));

    console.log('\n🔍 Recherche des tokens de réinitialisation...');
    const tokens = await prisma.passwordResetToken.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    if (tokens.length === 0) {
      console.log('❌ Aucun token de réinitialisation trouvé');
      console.log('L\'email de réinitialisation n\'a probablement pas été envoyé avec succès.');
    } else {
      console.log(`\n✅ ${tokens.length} token(s) trouvé(s):`);
      tokens.forEach((token, index) => {
        console.log(`\nToken #${index + 1}:`);
        console.log(`  - Créé le: ${token.createdAt}`);
        console.log(`  - Expire le: ${token.expiresAt}`);
        console.log(`  - Token: ${token.token.substring(0, 20)}...`);
        console.log(`  - Expiré: ${token.expiresAt < new Date() ? 'OUI ⚠️' : 'NON ✅'}`);
      });
    }

    // Vérifier les variables d'environnement
    console.log('\n🔧 Vérification des variables d\'environnement:');
    console.log(`  - BREVO_API_KEY: ${process.env.BREVO_API_KEY ? '✅ Définie' : '❌ NON DÉFINIE'}`);
    console.log(`  - EMAIL_FROM: ${process.env.EMAIL_FROM || '❌ NON DÉFINIE'}`);
    console.log(`  - NEXT_PUBLIC_SITE_URL: ${process.env.NEXT_PUBLIC_SITE_URL || '❌ NON DÉFINIE'}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkForgottenPassword();
