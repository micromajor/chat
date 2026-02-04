/**
 * Script pour tester le nettoyage des utilisateurs inactifs
 */

const CRON_SECRET = process.env.CRON_SECRET || "dev-secret-123";

async function testCleanup() {
  try {
    console.log("🧹 Test du nettoyage des utilisateurs inactifs...\n");
    
    const response = await fetch("http://localhost:3000/api/cron/cleanup-inactive", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${CRON_SECRET}`,
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Succès:", data.message);
      console.log(`   ${data.count} utilisateur(s) nettoyé(s)`);
    } else {
      console.error("❌ Erreur:", data.error);
    }
  } catch (error) {
    console.error("❌ Erreur de connexion:", error.message);
    console.log("\n💡 Assurez-vous que le serveur dev tourne (npm run dev)");
  }
}

testCleanup();
