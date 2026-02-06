/**
 * Script de création de faux profils pour peupler la plateforme
 * Usage: npx ts-node scripts/create-fake-profiles.ts
 * Ou en production: node scripts/create-fake-profiles.js (après compilation)
 */

import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Préfixes de pseudos suggestifs/osés pour un chat gay
const pseudoPrefixes = [
  "BogossActif", "BogossPassif", "MecViril", "JHChaud", "GarsCool",
  "MecPoilu", "SportifSexy", "BearGentil", "OursCalin", "TwinkMignon",
  "MecDirect", "BogossSympa", "GarsDiscret", "MecSportif", "ActifDoux",
  "PassifCoquin", "BisouBogoss", "MecCurieux", "GarsSensuel", "BogossBrun",
  "BlondSexy", "RouxCharmant", "MecTatoue", "GarsMuscu", "FitnessBoy",
  "RunnerHot", "NageurSexy", "CyclisteFit", "BoxeurViril", "RugbyMan",
  "FootBoy", "GymBoy", "YogaMan", "DanseurSexy", "ArtisteBohème",
  "MusicienCool", "ChefCuisto", "InfoSexy", "GarsBouclé", "MecRasé",
  "BarbuSexy", "MoustachuHot", "DaddyCool", "JeuneLouis", "MatthieuH",
  "LucasBg", "ThomasSexy", "HugoHot", "LeoCharmant", "NathanViril"
];

// Descriptions variées
const descriptions = [
  "Mec sympa et ouvert, à la recherche de rencontres cool 😊",
  "Sportif passionné, j'aime les mecs qui prennent soin d'eux 💪",
  "Discret et respectueux, pour rencontres sans prise de tête",
  "Nouveau sur le site, curieux de faire des rencontres",
  "Bear gentil cherche câlins et plus si affinités 🐻",
  "Twink mignon cherche son prince charmant 👑",
  "Direct et honnête, je sais ce que je veux",
  "Adepte du sport et des soirées entre potes",
  "Musicien dans l'âme, j'aime les mecs créatifs 🎵",
  "Cuisinier amateur, je te prépare un bon petit plat 🍳",
  "Voyageur dans l'âme, toujours partant pour une aventure",
  "Geek assumé, Netflix and chill ? 🎮",
  "Randonneur passionné, j'aime la nature et les beaux panoramas",
  "Artiste bohème cherche son muse",
  "Mec posé, j'aime les discussions profondes autour d'un verre",
  "Noctambule convaincu, on se retrouve en soirée ?",
  "Early bird, petit déj au lit ça te dit ? ☀️",
  "Amateur de ciné, on se fait une toile ?",
  "Bookworm en quête de son lecteur idéal 📚",
  "Épicurien, la vie est trop courte pour ne pas en profiter",
  null, // Certains sans description
  null,
  null,
];

// Départements français (codes)
const departments = [
  "75", "13", "69", "33", "31", "44", "67", "59", "06", "34",
  "35", "76", "57", "54", "21", "45", "37", "49", "72", "14",
  "50", "29", "56", "22", "85", "17", "16", "24", "40", "64",
  "65", "66", "11", "30", "84", "83", "04", "05", "38", "73",
  "74", "01", "42", "43", "63", "03", "58", "71", "89", "10"
];

// Pays (pour mixer un peu)
const countries = [
  { code: "FR", name: "France", weight: 40 }, // Plus de Français
  { code: "BE", name: "Belgique", weight: 5 },
  { code: "CH", name: "Suisse", weight: 3 },
  { code: "CA", name: "Canada", weight: 2 },
];

function getRandomCountry() {
  const totalWeight = countries.reduce((sum, c) => sum + c.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const country of countries) {
    if (random < country.weight) {
      return country.code;
    }
    random -= country.weight;
  }
  return "FR";
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomAge(): number {
  // Distribution réaliste des âges (18-65)
  const ranges = [
    { min: 18, max: 25, weight: 25 },
    { min: 26, max: 35, weight: 35 },
    { min: 36, max: 45, weight: 20 },
    { min: 46, max: 55, weight: 12 },
    { min: 56, max: 65, weight: 8 },
  ];

  const totalWeight = ranges.reduce((sum, r) => sum + r.weight, 0);
  let random = Math.random() * totalWeight;

  for (const range of ranges) {
    if (random < range.weight) {
      return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }
    random -= range.weight;
  }
  return 30;
}

function generateBirthDate(age: number): Date {
  const now = new Date();
  const year = now.getFullYear() - age;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
}

async function main() {
  console.log("🚀 Création des faux profils...\n");

  const createdUsers: string[] = [];
  const password = await bcrypt.hash("FakeProfile2026!", 10);

  for (let i = 0; i < 50; i++) {
    const prefix = pseudoPrefixes[i % pseudoPrefixes.length];
    const suffix = Math.floor(Math.random() * 900) + 100; // 100-999
    const pseudo = `${prefix}${suffix}`;
    
    const age = getRandomAge();
    const country = getRandomCountry();
    const department = country === "FR" ? getRandomElement(departments) : null;
    const description = getRandomElement(descriptions);
    
    // Statut en ligne aléatoire (30% en ligne, 70% hors ligne)
    const isOnline = Math.random() < 0.3;
    
    // lastSeenAt aléatoire (entre maintenant et 7 jours)
    const hoursAgo = Math.floor(Math.random() * 168); // 0-168 heures
    const lastSeenAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    // Email fictif unique
    const email = `fake.${pseudo.toLowerCase()}@menhir.test`;

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password,
          pseudo,
          birthDate: generateBirthDate(age),
          country,
          department,
          description,
          isOnline,
          isVerified: true, // Profils vérifiés pour qu'ils soient visibles
          isQuickAccess: false,
          lastSeenAt,
          searchAgeMin: Math.max(18, age - 10),
          searchAgeMax: Math.min(99, age + 15),
        },
      });

      createdUsers.push(pseudo);
      const status = isOnline ? "🟢" : "⚫";
      console.log(`${status} Créé: ${pseudo} (${age} ans, ${country}${department ? `-${department}` : ""})`);
    } catch (error: unknown) {
      // Pseudo ou email déjà existant, on passe
      const e = error as { code?: string };
      if (e.code === "P2002") {
        console.log(`⚠️  Ignoré (doublon): ${pseudo}`);
      } else {
        throw error;
      }
    }
  }

  console.log(`\n✅ ${createdUsers.length} profils créés avec succès !`);
  console.log("\n📊 Récapitulatif:");
  
  const stats = await prisma.user.groupBy({
    by: ["country"],
    _count: true,
    where: {
      email: { endsWith: "@menhir.test" }
    }
  });
  
  console.log("   Répartition par pays:");
  stats.forEach(s => {
    console.log(`   - ${s.country}: ${s._count} profils`);
  });
  
  const onlineCount = await prisma.user.count({
    where: {
      email: { endsWith: "@menhir.test" },
      isOnline: true
    }
  });
  
  console.log(`\n   🟢 En ligne: ${onlineCount} profils`);
  console.log(`   ⚫ Hors ligne: ${createdUsers.length - onlineCount} profils`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
