// netlify/functions/get-user-by-email.js
const { createClient } = require("./dbClient");

exports.handler = async (event) => {
  const email = event.queryStringParameters?.email;

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Email requerido" }),
    };
  }

  const client = createClient();

  try {
    await client.connect();

    const userRes = await client.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userRes.rows.length === 0) {
      await client.end();
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: "Usuario no encontrado" }),
      };
    }

    const user = userRes.rows[0];

    // Obtener historial de compras
    const historyRes = await client.query(
      "SELECT * FROM purchase_history WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );

    const history = [];

    for (const purchase of historyRes.rows) {
      const itemsRes = await client.query(
        `SELECT pi.*, p.name 
         FROM purchase_items pi
         JOIN products p ON pi.product_id = p.id
         WHERE pi.purchase_id = $1`,
        [purchase.id]
      );

      history.push({
        ...purchase,
        items: itemsRes.rows,
      });
    }

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: {
          ...user,
          purchase_history: history,
        },
      }),
    };
  } catch (err) {
    console.error("❌ Error en get-user-by-email:", err);
    await client.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Error interno", error: err.message }),
    };
  }
};
