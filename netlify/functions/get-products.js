const { createClient } = require("./dbClient");

exports.handler = async () => {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query("SELECT * FROM products");

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, products: result.rows }),
    };
  } catch (err) {
    console.error("❌ Error al obtener productos:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Error al obtener productos", error: err.message }),
    };
  } finally {
    // Cierra la conexión incluso si hubo error
    await client.end().catch((e) =>
      console.error("⚠️ Error al cerrar la conexión:", e.message)
    );
  }
};
