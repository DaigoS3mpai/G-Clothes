const { createClient } = require("./dbClient");

exports.handler = async () => {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query("SELECT * FROM products");

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        products: result.rows,
      }),
    };
  } catch (err) {
    console.error("❌ Error al obtener productos desde la base de datos:", err.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Error al obtener productos desde el servidor.",
        error: err.message,
      }),
    };
  } finally {
    try {
      await client.end();
    } catch (closeErr) {
      console.error("⚠️ Error al cerrar conexión con la base de datos:", closeErr.message);
    }
  }
};
