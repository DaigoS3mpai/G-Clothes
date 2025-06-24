const { createClient } = require("./dbClient");

exports.handler = async () => {
  const client = createClient();

  try {
    await client.connect();
    const result = await client.query("SELECT NOW() as now");
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Conexión exitosa a Neon",
        now: result.rows[0].now,
      }),
    };
  } catch (err) {
    console.error("❌ Error al conectar a Neon:", err.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
      }),
    };
  }
};
