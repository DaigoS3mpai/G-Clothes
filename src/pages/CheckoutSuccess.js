import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutSuccess = () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const paymentId = params.get("payment_id");

  const [purchaseRegistered, setPurchaseRegistered] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  const registerPurchase = async () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

    if (status === "approved" && currentUser && cartItems.length > 0 && !purchaseRegistered) {
      try {
        const res = await fetch("/.netlify/functions/add-purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUser.id,
            cartItems,
            amount: total,
            payment_id: paymentId, // 👈 se incluye el ID del pago
          }),
        });

        const data = await res.json();

        if (data.success) {
          setPurchaseRegistered(true);
          localStorage.removeItem("cart"); // ✅ limpia el carrito
        }
      } catch (err) {
        console.error("Error al registrar la compra:", err);
      }
    }

    // ⚠️ Seguridad: si ya está aprobado pero el carrito está vacío (porque se limpió antes),
    // asegúrate de no dejar basura
    if (status === "approved" && cartItems.length > 0) {
      localStorage.removeItem("cart");
    }
  };

  registerPurchase();
}, [status, paymentId, purchaseRegistered]);



  const renderContent = () => {
    switch (status) {
      case "approved":
        return (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">¡Gracias por tu compra!</h2>
            <p className="text-gray-700 mb-2">Tu pago fue aprobado correctamente.</p>
            <p className="text-sm text-gray-500">ID de pago: {paymentId}</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Seguir comprando
            </button>
          </>
        );
      case "pending":
        return (
          <>
            <h2 className="text-2xl font-bold text-yellow-600 mb-4">Pago pendiente</h2>
            <p className="text-gray-700 mb-2">Tu pago está siendo procesado. Te notificaremos cuando se confirme.</p>
            <p className="text-sm text-gray-500">ID de pago: {paymentId}</p>
          </>
        );
      case "rejected":
      case "failure":
        return (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Pago rechazado</h2>
            <p className="text-gray-700 mb-2">Hubo un problema con tu pago.</p>
            <p className="text-sm text-gray-500">Por favor, intenta nuevamente.</p>
          </>
        );
      default:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Estado desconocido</h2>
            <p className="text-gray-600">No pudimos determinar el estado de tu pago.</p>
          </>
        );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md text-center">
      {renderContent()}
    </div>
  );
};

export default CheckoutSuccess;
