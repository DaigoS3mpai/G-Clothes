const { Client } = require("pg");

exports.handler = async (event) => {
  const { name, email, password } = JSON.parse(event.body);
  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
  });

  try {
    await client.connect();

    const result = await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, user: result.rows[0] }),
    };
  } catch (error) {
    console.error("Error al registrar:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Error en el servidor" }),
    };
  } finally {
    await client.end();
  }
};
