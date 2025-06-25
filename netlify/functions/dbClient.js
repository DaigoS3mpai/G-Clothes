const { Client } = require("pg");

const createClient = () => {
  console.log("DATABASE_URL:", process.env.DATABASE_URL); // VERIFICA QUE NO SEA UNDEFINED

  return new Client({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_ypcxPeAqG2k9@ep-green-lab-a5dh2kny-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
    ssl: {
      rejectUnauthorized: false,
    },
  });
};

module.exports = { createClient };
