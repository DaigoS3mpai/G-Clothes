import React from 'react';

const CheckoutSuccess = () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const paymentId = params.get("payment_id");

  const renderContent = () => {
    switch (status) {
      case "approved":
        return (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">¡Gracias por tu compra!</h2>
            <p className="text-gray-700 mb-2">Tu pago fue aprobado correctamente.</p>
            <p className="text-sm text-gray-500">ID de pago: {paymentId}</p>
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

