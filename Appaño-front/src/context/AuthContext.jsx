import React, { createContext, useContext, useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar usuarios desde el microservicio al iniciar
  const refrescarUsuarios = async () => {
    try {
      const data = await usuarioService.obtenerTodos();
      setUsuariosDisponibles(data);

      const guardadoId = localStorage.getItem('usuarioActualId');
      if (guardadoId) {
        const encontrado = data.find((u) => u.id === Number(guardadoId) || u.id_usuario === Number(guardadoId));
        if (encontrado) {
          setUsuarioActual(encontrado);
          return;
        }
      }

      // Si no hay guardado, seleccionar el primero disponible
      if (data.length > 0) {
        setUsuarioActual(data[0]);
        localStorage.setItem('usuarioActualId', data[0].id || data[0].id_usuario);
      }
    } catch (err) {
      console.error('Error al cargar usuarios para la sesión:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    refrescarUsuarios();
  }, []);

  const cambiarUsuario = (id) => {
    const usuario = usuariosDisponibles.find((u) => u.id === Number(id) || u.id_usuario === Number(id));
    if (usuario) {
      setUsuarioActual(usuario);
      localStorage.setItem('usuarioActualId', usuario.id || usuario.id_usuario);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuarioActual,
        usuariosDisponibles,
        cambiarUsuario,
        refrescarUsuarios,
        cargando,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

