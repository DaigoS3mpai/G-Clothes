// Cargar el SDK de MercadoPago y devolver instancia
export const initializeMercadoPago = (publicKey) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => {
      const mp = new window.MercadoPago(publicKey, {
        locale: 'es-CL',
      });
      resolve(mp);
    };
    document.body.appendChild(script);
  });
};

// Crear preferencia de pago usando fetch al backend de MP
export const createPayment = async (mp, accessToken, items) => {
  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          title: `${item.name} (Talla: ${item.selectedSize || 'N/A'})`,
          unit_price: Number(item.price) || 1,
          quantity: item.quantity || 1,
        })),
        back_urls: {
          success: window.location.origin + '?status=approved',
          failure: window.location.origin + '?status=failure',
          pending: window.location.origin + '?status=pending',
        },
        auto_return: 'approved',
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error creating payment preference:', error);
    throw error;
  }
};
