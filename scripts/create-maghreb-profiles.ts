/**
 * Script d'ajout de profils maghrébins
 * Usage: npx tsx scripts/create-maghreb-profiles.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Pseudos maghrébins naturels - variés sans pattern évident
const maghrebProfiles = [
  { pseudo: "Karim_Bg", age: 28, country: "MA" },
  { pseudo: "MohamedCasa", age: 25, country: "MA" },
  { pseudo: "YassineOran", age: 23, country: "DZ" },
  { pseudo: "AmineTunis", age: 30, country: "TN" },
  { pseudo: "Said.Alger", age: 35, country: "DZ" },
  { pseudo: "RachidRabat", age: 32, country: "MA" },
  { pseudo: "IliesConstantine", age: 22, country: "DZ" },
  { pseudo: "SofianeT", age: 27, country: "TN" },
  { pseudo: "Nabil_Marra", age: 29, country: "MA" },
  { pseudo: "ZakariaDZ", age: 24, country: "DZ" },
  { pseudo: "MehdiSfax", age: 26, country: "TN" },
  { pseudo: "BilalTanger", age: 31, country: "MA" },
  { pseudo: "AdilDZ", age: 21, country: "DZ" },
  { pseudo: "OmarTunis", age: 34, country: "TN" },
  { pseudo: "Tarik.Fes", age: 28, country: "MA" },
];

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
    const pseudo = profile.pseudo;
    const description = getRandomElement(descriptions);
    
    // Statut en ligne aléatoire (40% en ligne pour les nouveaux)
    const isOnline = Math.random() < 0.4;
    
    const hoursAgo = Math.floor(Math.random() * 48);
    const lastSeenAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const email = `fake.${pseudo.toLowerCase().replace(/[._]/g, '')}@menhir.test`;

    try {
      await prisma.user.create({
        data: {
          email,
          password,
          pseudo,
          birthDate: generateBirthDate(profile.age),
          country: profile.country,
          department: null, // Pas de département pour le Maghreb
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
      const flag = profile.country === "MA" ? "🇲🇦" : profile.country === "DZ" ? "🇩🇿" : "🇹🇳";
      console.log(`${status} Créé: ${pseudo} (${profile.age} ans, ${flag} ${profile.country})`);
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
