import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearFakeDescriptions() {
  try {
    const result = await prisma.user.updateMany({
      where: {
        email: {
          endsWith: "@menhir.test"
        }
      },
      data: {
        description: null
      }
    });
    
    console.log(`✅ ${result.count} profils fakes mis à jour (descriptions supprimées)`);
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearFakeDescriptions();
