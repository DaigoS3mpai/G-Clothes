const { Client } = require("pg");

const createClient = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.warn("⚠️ DATABASE_URL no está definida. Usando fallback local.");
  } else {
    console.log("✅ DATABASE_URL detectada.");
  }

  return new Client({
    connectionString:
      databaseUrl ||
      "postgresql://neondb_owner:npg_ypcxPeAqG2k9@ep-green-lab-a5dh2kny-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
    ssl: {
      rejectUnauthorized: false,
    },
  });
};

module.exports = { createClient };
