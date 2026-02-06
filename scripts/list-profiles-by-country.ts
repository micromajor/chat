/**
 * Script pour lister les profils par pays
 * Usage: npx tsx scripts/list-profiles-by-country.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📊 Liste des profils par pays\n");

  const countries = ['FR', 'BE', 'CH', 'LU', 'MA', 'DZ', 'TN'];
  
  for (const country of countries) {
    const users = await prisma.user.findMany({
      where: { country },
      select: { pseudo: true, isOnline: true },
      orderBy: { pseudo: 'asc' }
    });
    
    if (users.length > 0) {
      console.log(`\n${country} (${users.length} profils):`);
      users.forEach(u => {
        const status = u.isOnline ? '🟢' : '⚫';
        console.log(`  ${status} ${u.pseudo}`);
      });
    }
  }
  
  const total = await prisma.user.count({
    where: { email: { endsWith: '@menhir.test' } }
  });
  
  console.log(`\n✅ Total faux profils: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
