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

      const token = localStorage.getItem('token');
      const guardadoId = localStorage.getItem('usuarioActualId');

      if (token && guardadoId) {
        const encontrado = data.find((u) => u.id === Number(guardadoId) || u.id_usuario === Number(guardadoId));
        if (encontrado) {
          setUsuarioActual(encontrado);
          return;
        }
      }

      // Si no hay token guardado, el estado permanece sin sesión para que ProtectedRoute actúe
      setUsuarioActual(null);
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

  const login = async (email, password) => {
    // Cuando el backend tenga Spring Security / JWT:
    // const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
    
    // Validación temporal con los usuarios reales del microservicio:
    const usuario = usuariosDisponibles.find(
      (u) => u.correo?.toLowerCase() === email?.trim().toLowerCase()
    );

    if (!usuario) {
      throw new Error('Usuario no encontrado con ese correo electrónico.');
    }

    setUsuarioActual(usuario);
    localStorage.setItem('usuarioActualId', usuario.id || usuario.id_usuario);
    localStorage.setItem('token', 'simulated-jwt-token-dev');
    return usuario;
  };

  const logout = () => {
    setUsuarioActual(null);
    localStorage.removeItem('usuarioActualId');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        usuarioActual,
        usuariosDisponibles,
        cambiarUsuario,
        refrescarUsuarios,
        login,
        logout,
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

