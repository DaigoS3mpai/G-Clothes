import React from "react";

const Cart = ({ cartItems, onRemoveFromCart, onPurchase }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Carrito de compras</h2>

      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {item.name} - Talla {item.size || "N/A"}
              </span>
              <span>${item.price.toFixed(2)}</span>
              <button
                className="text-red-600"
                onClick={() => onRemoveFromCart(index)}
              >
                Quitar
              </button>
            </div>
          ))}

          <div className="mt-4 font-semibold">Total: ${total.toFixed(2)}</div>

          <button
            onClick={onPurchase}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Finalizar compra
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
