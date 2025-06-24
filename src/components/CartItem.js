// src/pages/Cart.jsx
import React from 'react';
import CartItem from '../components/CartItem';

const Cart = ({ cartItems, onRemoveFromCart, onPurchase }) => {
  const formatCLP = (price) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        🛒 Tu carrito
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onRemove={() => onRemoveFromCart(index)}
              />
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-lg font-semibold">Total: {formatCLP(total)}</p>
            <button
              onClick={onPurchase}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🧾 Comprar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
