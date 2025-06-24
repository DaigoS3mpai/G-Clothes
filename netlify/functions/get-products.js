// netlify/functions/get-products.js
const { createClient } = require("./dbClient");

exports.handler = async () => {
  const client = createClient();

  try {
    await client.connect();

    const result = await client.query("SELECT * FROM products");

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, products: result.rows }),
    };
  } catch (err) {
    console.error("Error al obtener productos:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message }),
    };
  }
};
