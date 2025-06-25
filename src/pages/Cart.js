// src/pages/Cart.jsx
import React from "react";

const Cart = ({ cartItems, onRemoveFromCart, onPurchase }) => {
  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Carrito de compras</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="divide-y">
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between py-2">
                <span>{item.name || "Producto"}</span>
                <span>${parseFloat(item.price).toFixed(2)}</span>
                <button
                  className="text-red-500 hover:underline ml-4"
                  onClick={() => onRemoveFromCart(index)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 font-semibold text-lg">
            Total: ${total.toFixed(2)}
          </div>

          <button
            onClick={onPurchase}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Finalizar compra
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
