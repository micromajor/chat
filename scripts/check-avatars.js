const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      pseudo: true,
      avatar: true,
    }
  });

  console.log('\n=== Vérification des avatars en base ===\n');
  
  users.forEach(user => {
    if (user.avatar) {
      const size = Buffer.byteLength(user.avatar, 'utf8');
      const sizeKB = (size / 1024).toFixed(2);
      const preview = user.avatar.substring(0, 50);
      console.log(`✅ ${user.pseudo}: Avatar présent (${sizeKB} KB)`);
      console.log(`   Début: ${preview}...`);
    } else {
      console.log(`❌ ${user.pseudo}: Pas d'avatar`);
    }
  });

  console.log(`\n=== Total: ${users.length} utilisateurs ===`);
  const withAvatar = users.filter(u => u.avatar).length;
  console.log(`Avec avatar: ${withAvatar}`);
  console.log(`Sans avatar: ${users.length - withAvatar}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
