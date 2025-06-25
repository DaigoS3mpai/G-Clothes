// netlify/functions/insert-user.js
const { Client } = require("pg");

// Crea el cliente con la variable de entorno de Netlify
const createClient = () => {
  return new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // necesario si estás usando Neon o similar
    },
  });
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        success: false,
        message: "Método no permitido",
      }),
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch (err) {
    console.error("❌ Error al parsear JSON:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: "El body no es un JSON válido",
        error: err.message,
        bodyRecibido: event.body,
      }),
    };
  }

  const { name, email, password, address, phone } = parsed;

  if (!name || !email || !password || !address || !phone) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: "Todos los campos son obligatorios",
      }),
    };
  }

  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      `INSERT INTO users (name, email, password, address, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, password, address, phone]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, user: result.rows[0] }),
    };
  } catch (error) {
    console.error("❌ Error al registrar en la base de datos:", error);
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Error al registrar en la base de datos",
        error: error.message,
      }),
    };
  }
};
