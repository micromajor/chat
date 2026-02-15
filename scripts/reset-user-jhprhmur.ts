import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetUserPassword() {
  try {
    const pseudo = 'jhprhmur';
    const newPassword = 'Menhir2026!'; // Nouveau mot de passe temporaire
    
    console.log('🔍 Recherche de l\'utilisateur...');
    const user = await prisma.user.findUnique({
      where: { pseudo },
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
      console.log('❌ Utilisateur non trouvé:', pseudo);
      return;
    }

    console.log('\n✅ Utilisateur trouvé:');
    console.log(JSON.stringify(user, null, 2));

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { pseudo },
      data: { password: hashedPassword }
    });

    console.log('\n✅ Mot de passe réinitialisé avec succès!');
    console.log('\n🔑 NOUVEAUX IDENTIFIANTS:');
    console.log(`   Pseudo: ${pseudo}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Mot de passe: ${newPassword}`);
    console.log('\n⚠️ Changez ce mot de passe après votre première connexion!');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUserPassword();
