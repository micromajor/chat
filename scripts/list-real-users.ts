import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listRealUsers() {
  try {
    console.log('🔍 Recherche de tous les utilisateurs inscrits...\n');
    
    const users = await prisma.user.findMany({
      where: { 
        isQuickAccess: false 
      },
      select: {
        id: true,
        pseudo: true,
        email: true,
        isVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur inscrit trouvé');
      return;
    }

    console.log(`✅ ${users.length} utilisateur(s) inscrit(s) trouvé(s):\n`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. Pseudo: ${user.pseudo}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Vérifié: ${user.isVerified ? '✅' : '❌'}`);
      console.log(`   Créé le: ${user.createdAt.toLocaleString('fr-FR')}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listRealUsers();
