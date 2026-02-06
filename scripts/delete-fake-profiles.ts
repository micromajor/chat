/**
 * Script de suppression des faux profils
 * Usage: npx tsx scripts/delete-fake-profiles.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Suppression des faux profils...\n");

  const count = await prisma.user.count({
    where: {
      email: { endsWith: "@menhir.test" }
    }
  });

  console.log(`   Profils trouvés: ${count}`);

  if (count === 0) {
    console.log("   Aucun profil à supprimer.");
    return;
  }

  const result = await prisma.user.deleteMany({
    where: {
      email: { endsWith: "@menhir.test" }
    }
  });

  console.log(`\n✅ ${result.count} profils supprimés !`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
