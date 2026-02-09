import prisma from '../src/lib/prisma';
import { compare } from 'bcryptjs';

async function main() {
  const pseudo = 'jhprhmur44';
  const password = 'DenI7maN!';
  
  console.log(`Recherche utilisateur: ${pseudo}`);
  
  const user = await prisma.user.findFirst({
    where: { 
      pseudo: { 
        equals: pseudo,
        mode: 'insensitive'
      }
    }
  });
  
  if (!user) {
    console.log('❌ Utilisateur NON TROUVÉ');
    process.exit(1);
  }
  
  console.log(`✓ Utilisateur trouvé:
  - ID: ${user.id}
  - Pseudo: ${user.pseudo}
  - isVerified: ${user.isVerified}
  - isBanned: ${user.isBanned}
  - Password (20 premiers chars): ${user.password.substring(0, 20)}...`);
  
  const isPasswordValid = await compare(password, user.password);
  
  if (isPasswordValid) {
    console.log('✓ MOT DE PASSE VALIDE');
  } else {
    console.log('❌ MOT DE PASSE INVALIDE');
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
