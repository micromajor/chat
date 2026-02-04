const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOnlineUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        pseudo: true,
        isOnline: true,
        lastSeenAt: true,
      },
    });

    console.log('=== STATISTIQUES UTILISATEURS ===\n');
    console.log(`Total d'utilisateurs : ${users.length}`);
    console.log(`Utilisateurs en ligne : ${users.filter(u => u.isOnline).length}`);
    console.log(`Utilisateurs hors ligne : ${users.filter(u => !u.isOnline).length}`);
    
    console.log('\n=== UTILISATEURS EN LIGNE ===');
    const online = users.filter(u => u.isOnline);
    online.forEach(u => {
      const timeDiff = Date.now() - new Date(u.lastSeenAt).getTime();
      const minutesAgo = Math.floor(timeDiff / 60000);
      console.log(`${u.pseudo} - Vu il y a ${minutesAgo} minute(s)`);
    });

    console.log('\n=== UTILISATEURS HORS LIGNE ===');
    const offline = users.filter(u => !u.isOnline);
    offline.forEach(u => {
      const timeDiff = Date.now() - new Date(u.lastSeenAt).getTime();
      const minutesAgo = Math.floor(timeDiff / 60000);
      console.log(`${u.pseudo} - Vu il y a ${minutesAgo} minute(s)`);
    });
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOnlineUsers();
