/**
 * Script d'ajout de profils maghrébins
 * Usage: npx tsx scripts/create-maghreb-profiles.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Pseudos avec connotation maghrébine
const maghrebProfiles = [
  { pseudo: "KarimBg", age: 28 },
  { pseudo: "MohamedSexy", age: 25 },
  { pseudo: "YassineHot", age: 23 },
  { pseudo: "AmineCool", age: 30 },
  { pseudo: "SaidViril", age: 35 },
  { pseudo: "RachidMuscle", age: 32 },
  { pseudo: "IliesCharmant", age: 22 },
  { pseudo: "SofianeBeur", age: 27 },
  { pseudo: "NabilDoux", age: 29 },
  { pseudo: "ZakariaBg", age: 24 },
  { pseudo: "MehdiSportif", age: 26 },
  { pseudo: "BilalDiscret", age: 31 },
  { pseudo: "AdilCurieux", age: 21 },
  { pseudo: "OmarPassionné", age: 34 },
  { pseudo: "TarikSensuel", age: 28 },
];

// Départements avec forte communauté maghrébine
const departments = ["75", "93", "94", "95", "13", "69", "31", "59", "67", "38", "34", "06"];

const descriptions = [
  "Mec sympa et ouvert d'esprit, à la recherche de belles rencontres 😊",
  "Sportif passionné, j'aime les mecs authentiques 💪",
  "Discret et respectueux, pour des moments complices",
  "Nouveau ici, curieux de rencontrer des mecs cool",
  "Direct mais gentil, je sais ce que je veux",
  "Amateur de sport et de bonnes soirées entre potes",
  null,
  null,
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBirthDate(age: number): Date {
  const now = new Date();
  const year = now.getFullYear() - age;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
}

async function main() {
  console.log("🚀 Création des profils maghrébins...\n");

  const createdUsers: string[] = [];
  const password = await bcrypt.hash("FakeProfile2026!", 10);

  for (const profile of maghrebProfiles) {
    const suffix = Math.floor(Math.random() * 900) + 100;
    const pseudo = `${profile.pseudo}${suffix}`;
    const department = getRandomElement(departments);
    const description = getRandomElement(descriptions);
    
    // Statut en ligne aléatoire (40% en ligne pour les nouveaux)
    const isOnline = Math.random() < 0.4;
    
    const hoursAgo = Math.floor(Math.random() * 48);
    const lastSeenAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const email = `fake.${pseudo.toLowerCase()}@menhir.test`;

    try {
      await prisma.user.create({
        data: {
          email,
          password,
          pseudo,
          birthDate: generateBirthDate(profile.age),
          country: "FR",
          department,
          description,
          isOnline,
          isVerified: true,
          isQuickAccess: false,
          lastSeenAt,
          searchAgeMin: Math.max(18, profile.age - 10),
          searchAgeMax: Math.min(99, profile.age + 15),
        },
      });

      createdUsers.push(pseudo);
      const status = isOnline ? "🟢" : "⚫";
      console.log(`${status} Créé: ${pseudo} (${profile.age} ans, FR-${department})`);
    } catch (error: unknown) {
      const e = error as { code?: string };
      if (e.code === "P2002") {
        console.log(`⚠️  Ignoré (doublon): ${pseudo}`);
      } else {
        throw error;
      }
    }
  }

  console.log(`\n✅ ${createdUsers.length} profils maghrébins créés !`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
