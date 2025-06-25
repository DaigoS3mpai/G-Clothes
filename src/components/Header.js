import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = ({ cartCount = 0, currentUser, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        GClothes
      </Link>

      <nav className="space-x-4">
        <Link to="/products" className="hover:text-blue-500">
          Productos
        </Link>

        <Link to="/cart" className="hover:text-blue-500">
          Carrito ({cartCount})
        </Link>

        {currentUser ? (
          <>
            <Link to="/profile" className="hover:text-blue-500">
              Perfil
            </Link>
            <button onClick={onLogout} className="text-red-600 hover:underline">
              Cerrar sesión
            </button>
          </>
        ) : (
          <button onClick={handleLoginClick} className="text-blue-600 hover:underline">
            Iniciar sesión
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
