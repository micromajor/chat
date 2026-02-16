const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://menhir:menhir2026secure!@89.167.63.22:5432/menhir?schema=public'
});

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'dp1985.webmaster@gmail.com' },
      select: {
        id: true,
        pseudo: true,
        email: true,
        isVerified: true,
        isQuickAccess: true,
        createdAt: true
      }
    });

    if (user) {
      console.log('✅ Utilisateur trouvé:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('❌ Aucun utilisateur trouvé avec cet email');
    }

    // Vérifier aussi les tokens de réinitialisation
    const tokens = await prisma.passwordResetToken.findMany({
      where: { email: 'dp1985.webmaster@gmail.com' },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    if (tokens.length > 0) {
      console.log('\n📧 Tokens de réinitialisation trouvés:');
      console.log(JSON.stringify(tokens, null, 2));
    } else {
      console.log('\n📭 Aucun token de réinitialisation trouvé');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
