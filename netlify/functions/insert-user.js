// netlify/functions/insert-user.js
const { createClient } = require("./dbClient");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, password, name, address, phone } = JSON.parse(event.body || "{}");

  // Validación básica
  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Email y contraseña son obligatorios." }),
    };
  }

  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      `INSERT INTO users (email, password, name, address, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, password, name || "", address || "", phone || ""]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Usuario registrado",
        user: result.rows[0],
      }),
    };
  } catch (err) {
    await client.end();

    if (err.code === '23505') {
      // Error de duplicado (email ya registrado)
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "El correo ya está registrado.",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message }),
    };
  }
};

