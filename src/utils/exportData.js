import { exportUsersToSQL, exportProductsToSQL } from '../mock/database';

// Función para descargar el SQL de usuarios
export const downloadUsersSQL = () => {
  const sqlContent = exportUsersToSQL();
  const blob = new Blob([sqlContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gclothes_users.sql';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Función para descargar el SQL de productos
export const downloadProductsSQL = () => {
  const sqlContent = exportProductsToSQL();
  const blob = new Blob([sqlContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gclothes_products.sql';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
// DONE