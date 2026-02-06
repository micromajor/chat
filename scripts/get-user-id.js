// Script temporaire pour récupérer l'ID d'un utilisateur
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const pseudo = process.argv[2] || "dorian23a";
  const user = await prisma.user.findFirst({
    where: { pseudo },
    select: { id: true, pseudo: true }
  });
  
  if (user) {
    console.log(JSON.stringify(user));
  } else {
    console.log("User not found");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
