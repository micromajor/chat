import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: {
      pseudo: {
        contains: 'dorian',
        mode: 'insensitive'
      }
    },
    select: {
      id: true,
      pseudo: true,
      email: true,
      isQuickAccess: true
    }
  });
  
  console.log("Utilisateur trouvé:", JSON.stringify(user, null, 2));
}

main().finally(() => prisma.$disconnect());
