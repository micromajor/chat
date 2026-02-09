import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function resetPassword() {
  const pseudo = process.argv[2];
  const newPassword = process.argv[3];
  
  if (!pseudo || !newPassword) {
    console.log("Usage: npx tsx reset-password.ts <pseudo> <new_password>");
    process.exit(1);
  }
  
  try {
    const hashedPassword = await hash(newPassword, 12);
    
    const result = await prisma.user.updateMany({
      where: {
        pseudo: {
          equals: pseudo,
          mode: "insensitive"
        }
      },
      data: {
        password: hashedPassword
      }
    });
    
    if (result.count > 0) {
      console.log(`✅ Mot de passe réinitialisé pour ${pseudo}`);
    } else {
      console.log(`❌ Utilisateur ${pseudo} non trouvé`);
    }
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
