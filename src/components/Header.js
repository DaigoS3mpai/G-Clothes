// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ cartCount = 0 }) => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('currentUser');

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div
        className="text-xl font-bold text-black cursor-pointer"
        onClick={() => navigate('/')}
      >
        GClothes
      </div>

      <nav className="flex gap-4 items-center">
        <button onClick={() => navigate('/products')} className="text-gray-700 hover:text-blue-600">
          Productos
        </button>
        <button onClick={() => navigate('/cart')} className="text-gray-700 hover:text-blue-600">
          Carrito ({cartCount})
        </button>
        {isLoggedIn ? (
          <>
            <button onClick={() => navigate('/profile')} className="text-gray-700 hover:text-blue-600">
              Perfil
            </button>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-600">
              Cerrar sesión
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">
            Iniciar sesión
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
