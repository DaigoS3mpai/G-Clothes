const mercadopago = require('mercadopago');
const { createClient } = require('./dbClient');

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  const client = createClient();

  try {
    const body = JSON.parse(event.body);

    if (body.type !== 'payment') {
      return { statusCode: 200, body: 'Ignored non-payment event' };
    }

    const paymentId = body.data.id;
    const payment = await mercadopago.payment.findById(paymentId);

    if (!payment || !payment.body || !payment.body.payer) {
      throw new Error('Información de pago incompleta');
    }

    const email = payment.body.payer.email;

    await client.connect();

    // Obtener el ID del usuario desde la base de datos
    const userResult = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rowCount === 0) {
      throw new Error(`Usuario con email ${email} no encontrado`);
    }

    const userId = userResult.rows[0].id;

    // Actualizar la compra más reciente del usuario (sin usar product)
    await client.query(
      `UPDATE purchase_history
       SET payment_id = $1
       WHERE id = (
         SELECT id FROM purchase_history
         WHERE user_id = $2
         ORDER BY created_at DESC
         LIMIT 1
       )`,
      [paymentId, userId]
    );

    await client.end();

    return {
      statusCode: 200,
      body: 'Webhook procesado correctamente',
    };
  } catch (error) {
    console.error('Error en webhook de MercadoPago:', error.message);
    return {
      statusCode: 500,
      body: 'Error interno del servidor',
    };
  }
};
