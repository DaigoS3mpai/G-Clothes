const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { items } = JSON.parse(event.body || "{}");

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Items faltantes o inválidos" }),
      };
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN; // ⚠️ Define esto en tu entorno Netlify
    if (!accessToken) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: "Token de acceso no configurado" }),
      };
    }

    const preference = {
      items: items.map((item) => ({
        title: `${item.name} (Talla: ${item.selectedSize || 'N/A'})`,
        quantity: item.quantity || 1,
        unit_price: Number(item.price) || 1,
        currency_id: "CLP",
      })),
      back_urls: {
        success: `${event.headers.origin || 'https://g-dothes.netlify.app'}/checkout-success?status=approved`,
        pending: `${event.headers.origin || 'https://g-dothes.netlify.app'}/checkout-success?status=pending`,
        failure: `${event.headers.origin || 'https://g-dothes.netlify.app'}/checkout-success?status=failure`,
      },
      auto_return: "approved",
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();

    if (data.init_point) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, init_point: data.init_point }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: "No se pudo crear la preferencia", error: data }),
      };
    }
  } catch (err) {
    console.error("Error en create-preference:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Error del servidor", error: err.message }),
    };
  }
};
