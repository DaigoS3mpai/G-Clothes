// netlify/functions/add-purchase.js
const { createClient } = require("./dbClient");

exports.handler = async (event) => {
  const { user_id, cartItems, amount, payment_id } = JSON.parse(event.body || "{}");

  if (!user_id || !cartItems || !amount) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Faltan datos de compra" }),
    };
  }

  const safeAmount = parseFloat(amount);
  if (isNaN(safeAmount)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "El monto es inválido." }),
    };
  }

  const client = createClient();

  try {
    await client.connect();

    // ✅ Insertar en purchase_history (ahora con payment_id si está disponible)
    const purchaseResult = await client.query(
      "INSERT INTO purchase_history (user_id, product, amount, payment_id) VALUES ($1, $2, $3, $4) RETURNING id",
      [user_id, cartItems.map((item) => item.name).join(", "), safeAmount, payment_id || null]
    );

    const purchaseId = purchaseResult.rows[0].id;

    // Insertar cada ítem en purchase_items
    for (const item of cartItems) {
      if (!item.id || !item.selectedSize) {
        throw new Error("Cada producto debe tener un ID y una talla seleccionada.");
      }

      await client.query(
        "INSERT INTO purchase_items (purchase_id, product_id, size, quantity) VALUES ($1, $2, $3, $4)",
        [purchaseId, item.id, item.selectedSize, 1]
      );
    }

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, purchase_id: purchaseId }),
    };
  } catch (err) {
    console.error("Error en add-purchase:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message }),
    };
  }
};
