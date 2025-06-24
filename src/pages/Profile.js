import React, { useState, useEffect } from 'react';
import {
  getUserProfile,
  updateUserProfile,
  requestRefund,
} from '../utils/api';

const Profile = ({ currentUser, onLogout, onNavigate }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(!!currentUser);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;

      setLoading(true);
      try {
        const response = await getUserProfile(currentUser.email);
        if (response.success) {
          setProfile(response.user);
          setFormData(response.user);
        } else {
          setError(response.message);
          localStorage.clear();
          sessionStorage.clear();
          onLogout?.();
        }
      } catch (err) {
        setError('Error al cargar el perfil.');
        localStorage.clear();
        sessionStorage.clear();
        onLogout?.();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    const res = await updateUserProfile(formData.id, formData);
    if (res.success) {
      setSuccessMessage('Perfil actualizado con éxito.');
      setIsEditing(false);
      setProfile(res.user);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
    } else {
      setError(res.message);
    }
  };

  const handleRefund = async (purchaseId) => {
    const res = await requestRefund(profile.id, purchaseId);
    if (res.success) {
      setSuccessMessage(res.message);
      const updatedHistory = profile.purchase_history.map((p) =>
        p.id === purchaseId ? { ...p, refund_status: "approved" } : p
      );
      setProfile({ ...profile, purchase_history: updatedHistory });
    } else {
      setError(res.message);
    }
  };

  if (!currentUser) return <p className="text-center mt-10">No has iniciado sesión.</p>;
  if (loading) return <p className="text-center mt-10 text-gray-600">Cargando...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Perfil de usuario</h2>

      {successMessage && (
        <p className="text-green-600 text-center mb-4">{successMessage}</p>
      )}

      {isEditing ? (
        <>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="Correo"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            placeholder="Dirección"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="Teléfono"
            className="w-full p-2 mb-2 border rounded"
          />
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-1 border rounded text-gray-500 hover:text-black"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </>
      ) : (
        <>
          <p><strong>Nombre:</strong> {profile.name}</p>
          <p><strong>Correo:</strong> {profile.email}</p>
          <p><strong>Dirección:</strong> {profile.address}</p>
          <p><strong>Teléfono:</strong> {profile.phone}</p>
          <div className="flex justify-end mt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1 border rounded hover:bg-gray-100"
            >
              Editar
            </button>
          </div>
        </>
      )}

      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">Historial de compras</h3>
      {profile.purchase_history?.length > 0 ? (
        <ul className="space-y-4">
          {profile.purchase_history.map((purchase) => (
            <li key={purchase.id} className="border p-4 rounded-md bg-gray-50">
              <p className="text-sm text-gray-600">
                <strong>Fecha:</strong> {new Date(purchase.created_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total:</strong> {formatPrice(purchase.amount)}
              </p>

              <ul className="mt-2 space-y-1">
                {purchase.items?.map((item, index) => (
                  <li key={index} className="text-sm text-gray-800 ml-2 list-disc">
                    {item.name} — Talla: <strong>{item.size}</strong> — Cantidad: {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="mt-2">
                <strong>Estado:</strong>{' '}
                {purchase.refund_status === 'approved' ? (
                  <span className="text-green-600">Reembolsado</span>
                ) : purchase.refund_status === 'requested' ? (
                  <span className="text-yellow-600">Reembolso en trámite</span>
                ) : (
                  <button
                    onClick={() => handleRefund(purchase.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Solicitar reembolso
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No hay compras registradas.</p>
      )}
    </div>
  );
};

export default Profile;
