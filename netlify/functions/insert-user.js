const { Client } = require("pg");

exports.handler = async (event) => {
  const { name, email, password, address, phone } = JSON.parse(event.body);
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
  });

  try {
    await client.connect();

    const result = await client.query(
      `INSERT INTO users (name, email, password, address, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, password, address, phone]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, user: result.rows[0] }),
    };
  } catch (error) {
    console.error("Error al registrar:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Error en el servidor: " + error.message,
      }),
    };
  } finally {
    await client.end();
  }
};
