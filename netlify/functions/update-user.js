const { createClient } = require("./dbClient");

exports.handler = async (event) => {
  if (event.httpMethod !== "PUT") {
    return {
      statusCode: 405,
      body: "Método no permitido",
    };
  }

  const { id, name, email, address, phone } = JSON.parse(event.body || "{}");

  if (!id || !name || !email || !address || !phone) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Todos los campos son obligatorios." }),
    };
  }

  const client = createClient();

  try {
    await client.connect();

    const result = await client.query(
      `UPDATE users
       SET name = $1, email = $2, address = $3, phone = $4
       WHERE id = $5
       RETURNING *`,
      [name, email, address, phone, id]
    );

    await client.end();

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: "Usuario no encontrado." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, user: result.rows[0] }),
    };
  } catch (err) {
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message }),
    };
  }
};
