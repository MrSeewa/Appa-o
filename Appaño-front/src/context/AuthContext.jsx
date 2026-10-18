import React, { createContext, useContext, useState, useEffect } from 'react';
import { servicioUsuario } from '../services/usuarioService';

const ContextoAutenticacion = createContext();

export const ProveedorAutenticacion = ({ children }) => {
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar usuarios desde el microservicio al iniciar
  const refrescarUsuarios = async () => {
    try {
      const datos = await servicioUsuario.obtenerTodos();
      setUsuariosDisponibles(datos);

      const token = localStorage.getItem('token');
      const idGuardado = localStorage.getItem('usuarioActualId');

      if (token && idGuardado) {
        const usuarioEncontrado = datos.find(
          (u) => u.id === Number(idGuardado) || u.id_usuario === Number(idGuardado)
        );
        if (usuarioEncontrado) {
          setUsuarioActual(usuarioEncontrado);
          return;
        }
      }

      // Si no hay token guardado, el estado permanece sin sesión
      setUsuarioActual(null);
    } catch (error) {
      console.error('Error al cargar usuarios para la sesión:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    refrescarUsuarios();
  }, []);

  const cambiarUsuario = (id) => {
    const usuarioSeleccionado = usuariosDisponibles.find(
      (u) => u.id === Number(id) || u.id_usuario === Number(id)
    );
    if (usuarioSeleccionado) {
      setUsuarioActual(usuarioSeleccionado);
      localStorage.setItem('usuarioActualId', usuarioSeleccionado.id || usuarioSeleccionado.id_usuario);
    }
  };

  const iniciarSesion = async (correo, contrasena) => {
    // Cuando el backend tenga Spring Security / JWT:
    // const res = await axios.post('http://localhost:8080/api/auth/login', { correo, contrasena });

    // Validación temporal con los usuarios reales del microservicio:
    const usuarioEncontrado = usuariosDisponibles.find(
      (u) => u.correo?.toLowerCase() === correo?.trim().toLowerCase()
    );

    if (!usuarioEncontrado) {
      throw new Error('Usuario no encontrado con ese correo electrónico.');
    }

    setUsuarioActual(usuarioEncontrado);
    localStorage.setItem('usuarioActualId', usuarioEncontrado.id || usuarioEncontrado.id_usuario);
    localStorage.setItem('token', 'simulated-jwt-token-dev');
    return usuarioEncontrado;
  };

  const cerrarSesion = () => {
    setUsuarioActual(null);
    localStorage.removeItem('usuarioActualId');
    localStorage.removeItem('token');
  };

  const actualizarDatosSesion = (usuarioActualizado) => {
    setUsuarioActual(usuarioActualizado);
    setUsuariosDisponibles((usuariosPrevios) =>
      usuariosPrevios.map((u) =>
        (u.id === usuarioActualizado.id || u.id_usuario === usuarioActualizado.id_usuario)
          ? usuarioActualizado
          : u
      )
    );
  };

  const registrarUsuario = async (datosNuevoUsuario) => {
    const nuevoUsuario = await servicioUsuario.crear(datosNuevoUsuario);
    setUsuariosDisponibles((previos) => [...previos, nuevoUsuario]);
    setUsuarioActual(nuevoUsuario);
    localStorage.setItem('usuarioActualId', nuevoUsuario.id || nuevoUsuario.id_usuario);
    localStorage.setItem('token', 'simulated-jwt-token-dev');
    return nuevoUsuario;
  };

  return (
    <ContextoAutenticacion.Provider
      value={{
        usuarioActual,
        usuariosDisponibles,
        cambiarUsuario,
        refrescarUsuarios,
        actualizarDatosSesion,
        registrarUsuario,
        iniciarSesion,
        cerrarSesion,
        // Alias de compatibilidad
        login: iniciarSesion,
        logout: cerrarSesion,
        registro: registrarUsuario,
        cargando,
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
};

export const useAutenticacion = () => {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error('useAutenticacion debe ser utilizado dentro de un ProveedorAutenticacion');
  }
  return contexto;
};

// Alias compatibles
export const AuthProvider = ProveedorAutenticacion;
export const useAuth = useAutenticacion;
export const AuthContext = ContextoAutenticacion;
