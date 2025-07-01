import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = ({ onLogin, onRegister, onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const previousPath = location.state?.from || '/'; // Ruta previa o inicio

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateRegisterFields = () => {
    const { name, email, password, address, phone } = formData;

    if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(name)) {
      return '❌ El nombre solo debe contener letras.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return '❌ El correo no es válido.';
    }
    if (password.length < 6) {
      return '❌ La contraseña debe tener al menos 6 caracteres.';
    }
    if (!address || address.length < 6) {
      return '❌ La dirección debe tener al menos 6 caracteres.';
    }
    if (!/^\+\d{8,15}$/.test(phone)) {
      return '❌ El número debe comenzar con "+" y tener entre 8 y 15 dígitos.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      const validationError = validateRegisterFields();
      if (validationError) {
        setError(validationError);
        return;
      }
      const { email, password, name, address, phone } = formData;
      const res = await onRegister(email, password, name, address, phone);
      if (!res.success) {
        setError(res.message);
      } else {
        navigate(previousPath); // ✅ Redirige a la ruta previa
      }
    } else {
      const { email, password } = formData;
      const res = await onLogin(email, password);
      if (!res.success) {
        setError(res.message);
      } else {
        navigate(previousPath); // ✅ Redirige a la ruta previa
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegistering && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="address"
                placeholder="Dirección"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Teléfono (ej: +56912345678)"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          {isRegistering ? (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setIsRegistering(false);
                  setError('');
                }}
              >
                Iniciar sesión
              </button>
            </p>
          ) : (
            <p>
              ¿No tienes cuenta?{' '}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setIsRegistering(true);
                  setError('');
                }}
              >
                Crear cuenta
              </button>
            </p>
          )}
        </div>

          <button
            onClick={() => navigate(previousPath)}
            className="mt-4 w-full py-1 text-sm text-gray-500 hover:text-black"
          >
            ✖️ Cancelar
          </button>

      </div>
    </div>
  );
};

export default Login;
