/**
 * Script de diagnostic rapide
 * Usage: npx tsx scripts/diag-online.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  // Compter les online avec lastSeenAt récent (ce que l'API affiche)
  const trueOnline = await prisma.user.count({
    where: {
      isOnline: true,
      lastSeenAt: { gte: fiveMinutesAgo }
    }
  });
  
  // Compter les online avec lastSeenAt ancien (fantômes)
  const ghostsOnline = await prisma.user.count({
    where: {
      isOnline: true,
      lastSeenAt: { lt: fiveMinutesAgo }
    }
  });
  
  // Fakes online
  const fakesOnline = await prisma.user.findMany({
    where: { 
      email: { contains: "@menhir.test" },
      isOnline: true 
    },
    select: { pseudo: true, lastSeenAt: true },
    take: 10
  });
  
  console.log("=== Diagnostic Online ===\n");
  console.log("✅ Vraiment online (isOnline + lastSeen < 5min):", trueOnline);
  console.log("👻 Fantômes (isOnline mais lastSeen > 5min):", ghostsOnline);
  console.log("\nFakes online:", fakesOnline.length);
  
  for (const f of fakesOnline) {
    const ago = Math.round((Date.now() - new Date(f.lastSeenAt).getTime()) / 60000);
    console.log(`  - ${f.pseudo} | lastSeen: ${ago} min ago`);
  }
  
  // Total des fakes
  const totalFakes = await prisma.user.count({
    where: { email: { contains: "@menhir.test" } }
  });
  console.log("\nTotal fakes en DB:", totalFakes);
  
  await prisma.$disconnect();
}

main().catch(console.error);
