// netlify/functions/insert-user.js
const { createClient } = require("./dbClient");

exports.handler = async (event) => {
  const { name, email, password, address, phone } = JSON.parse(event.body);

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
    console.error("Error al registrar:", error);
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message || "Error en el servidor",
        detail: error.detail || null,
      }),
    };
  }
};
