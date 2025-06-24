// netlify/functions/request-refund.js
const { createClient } = require('./dbClient');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  const { user_id, purchase_id } = JSON.parse(event.body);
  const client = createClient();

  try {
    await client.connect();

    // Obtener payment_id desde la compra
    const res = await client.query(
      "SELECT payment_id FROM purchase_history WHERE id = $1 AND user_id = $2",
      [purchase_id, user_id]
    );

    const payment_id = res.rows?.[0]?.payment_id;
    if (!payment_id) throw new Error("payment_id no encontrado.");

    // Generar clave idempotente
    const idempotencyKey = uuidv4();

    // Enviar solicitud de reembolso a MercadoPago
    const refundRes = await fetch(
      `https://api.mercadopago.com/v1/payments/${payment_id}/refunds`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey,
        },
      }
    );

    const refundData = await refundRes.json();

    if (!refundRes.ok) {
      console.error("Error al hacer reembolso:", refundData);
      throw new Error(refundData.message || "Error al procesar reembolso");
    }

    // Extraer estado del reembolso (approved, in_process, rejected, etc.)
    const refundStatus = refundData.status || 'in_process';

    // Actualizar la base de datos con el estado del reembolso
    await client.query(
      "UPDATE purchase_history SET refund_status = $1 WHERE id = $2",
      [refundStatus, purchase_id]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: `Reembolso ${refundStatus}.` }),
    };

  } catch (err) {
    console.error("Error en reembolso:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message }),
    };
  }
};
