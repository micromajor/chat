// Script pour vérifier les utilisateurs et ajouter des infos de profil
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Vérifier tous les utilisateurs
  await prisma.user.updateMany({
    data: { isVerified: true }
  });

  // Mettre à jour les villes pour les tests
  await prisma.user.update({
    where: { pseudo: 'Thomas75' },
    data: { city: 'Paris', description: 'Développeur passionné, amateur de cinéma et de bons restos.' }
  });

  await prisma.user.update({
    where: { pseudo: 'MarcLyon69' },
    data: { city: 'Lyon', description: 'Sportif et voyageur. Fan de rugby et de randonnée.' }
  });

  await prisma.user.update({
    where: { pseudo: 'AlexMarseille' },
    data: { city: 'Marseille', description: 'Amoureux de la mer, DJ le weekend. 🎧🌊' }
  });

  const users = await prisma.user.findMany({
    select: { id: true, pseudo: true, email: true, isVerified: true, city: true, description: true }
  });
  console.log('Utilisateurs:', JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
