import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { usuarioActual, cargando } = useAuth();
  const token = localStorage.getItem('token');

  // Si aún está cargando la sesión inicial desde localStorage/API, evitamos redirecciones prematuras
  if (cargando) {
    return (
      <div className="state-box" style={{ maxWidth: '400px', margin: '4rem auto' }}>
        <div className="spinner"></div>
        <p>Verificando credenciales...</p>
      </div>
    );
  }

  // Verificamos si existe el token en el almacenamiento local
  if (!token && !usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  // Outlet permite renderizar las rutas hijas protegidas
  return <Outlet />;
}

