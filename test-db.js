// Test de connexion PostgreSQL
const { Client } = require('pg');

async function testConnection() {
  // Tester avec postgres (base par défaut)
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
  });

  try {
    await client.connect();
    console.log('✅ Connexion PostgreSQL réussie\n');
    
    // Lister toutes les bases de données
    const result = await client.query(
      "SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname;"
    );
    
    console.log('📊 Bases de données disponibles:');
    result.rows.forEach(row => {
      console.log(`  - ${row.datname}`);
    });
    
    await client.end();
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

testConnection();
