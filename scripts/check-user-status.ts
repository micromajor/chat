import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  // Les fakes sont identifiés par email @menhir.test
  
  // Chercher Menhir_25738
  const user = await prisma.user.findFirst({
    where: { pseudo: 'Menhir_25738' },
    select: {
      id: true,
      pseudo: true,
      email: true,
      isQuickAccess: true,
      isOnline: true,
      lastSeenAt: true,
      createdAt: true,
      country: true,
      department: true
    }
  });
  console.log('=== Utilisateur Menhir_25738 ===');
  if (user) {
    const isFake = user.email.endsWith('@menhir.test');
    console.log(JSON.stringify({ ...user, isFake }, null, 2));
  } else {
    console.log('Non trouvé');
  }
  
  // Compter les anonymes (vrais, pas fakes) hors ligne
  const anonymesOfflineCount = await prisma.user.count({
    where: {
      isQuickAccess: true,
      email: { not: { endsWith: '@menhir.test' } },
      isOnline: false
    }
  });
  console.log('\n=== Anonymes (vrais, pas fakes) hors ligne ===');
  console.log('Total:', anonymesOfflineCount);
  
  // Lister les anonymes hors ligne
  const anonymesOffline = await prisma.user.findMany({
    where: {
      isQuickAccess: true,
      email: { not: { endsWith: '@menhir.test' } },
      isOnline: false
    },
    select: {
      pseudo: true,
      email: true,
      isOnline: true,
      lastSeenAt: true,
      createdAt: true
    },
    orderBy: { lastSeenAt: 'desc' },
    take: 20
  });
  
  if (anonymesOffline.length > 0) {
    console.log('\nDerniers anonymes (vrais) hors ligne:');
    anonymesOffline.forEach(u => {
      console.log(`- ${u.pseudo} | Email: ${u.email} | Dernière vue: ${u.lastSeenAt}`);
    });
  }
  
  // Regarder les fakes actuellement en ligne
  const fakesOnlineCount = await prisma.user.count({
    where: {
      email: { endsWith: '@menhir.test' },
      isOnline: true
    }
  });
  console.log('\n=== Stats fakes ===');
  console.log('Fakes en ligne:', fakesOnlineCount);
  
  // Compter les fakes hors ligne
  const fakesOfflineCount = await prisma.user.count({
    where: {
      email: { endsWith: '@menhir.test' },
      isOnline: false
    }
  });
  console.log('Fakes hors ligne:', fakesOfflineCount);
  
  // Lister tous les profils avec pseudo Menhir_* visibles (qui ne sont PAS fakes)
  const realMenhirPseudos = await prisma.user.findMany({
    where: {
      pseudo: { startsWith: 'Menhir_' },
      email: { not: { endsWith: '@menhir.test' } }
    },
    select: {
      pseudo: true,
      email: true,
      isQuickAccess: true,
      isOnline: true,
      lastSeenAt: true
    },
    take: 20
  });
  console.log('\n=== Vrais utilisateurs avec pseudo Menhir_* ===');
  console.log('Total:', realMenhirPseudos.length);
  realMenhirPseudos.forEach(u => {
    console.log(`- ${u.pseudo} | isQuickAccess: ${u.isQuickAccess} | isOnline: ${u.isOnline} | Dernière: ${u.lastSeenAt}`);
  });
  
  await prisma.$disconnect();
}

check().catch(console.error);
