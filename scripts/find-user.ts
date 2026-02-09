import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const search = process.argv[2] || 'jrph';
  const users = await prisma.user.findMany({
    where: {
      pseudo: {
        contains: search,
        mode: 'insensitive'
      }
    },
    select: {
      id: true,
      pseudo: true,
      email: true,
      isVerified: true,
      isBanned: true,
      isQuickAccess: true
    }
  });
  
  console.log("Utilisateurs trouvés:", JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
