// src/pages/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { initializeMercadoPago } from "../utils/mercadoPago"; // Asegúrate de tener este archivo

// Formatear CLP sin decimales
const formatPrice = (price) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const Cart = ({ cartItems, onRemoveFromCart, onPurchase }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

  const handleCheckout = async () => {
    if (!currentUser) {
      alert("Debes iniciar sesión para comprar");
      return;
    }

    for (const item of cartItems) {
      if (!item.selectedSize) {
        alert(`Falta seleccionar talla para ${item.name}`);
        return;
      }
    }

    try {
      // Llamamos a la función create-preference del backend
      const res = await fetch("/.netlify/functions/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await res.json();

      if (data && data.init_point) {
        // Redirigimos al usuario al checkout de MercadoPago
        window.location.href = data.init_point;
      } else {
        alert("No se pudo generar la preferencia de pago");
      }
    } catch (error) {
      console.error("Error al generar preferencia:", error);
      alert("Error al conectar con MercadoPago");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Carrito de compras</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                index={index}
                onRemove={onRemoveFromCart}
              />
            ))}
          </ul>

          <div className="mt-6 text-right">
            <p className="text-lg font-semibold">Total: {formatPrice(total)}</p>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
