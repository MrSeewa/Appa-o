import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../context/AuthContext';

export const BarraNavegacion = () => {
  const { usuarioActual, usuariosDisponibles, cambiarUsuario, cerrarSesion } = useAutenticacion();
  const ubicacion = useLocation();
  const navegar = useNavigate();

  const manejarCerrarSesion = () => {
    // 1. Destruimos la sesión local mediante el contexto
    cerrarSesion();

    // 2. Redirigimos al login limpiando el historial de navegación
    navegar('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <span className="brand-text">Yo Appaño</span>
          <span className="brand-badge">metro</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${
              ubicacion.pathname === '/' || ubicacion.pathname === '/eventos'
                ? 'active'
                : ''
            }`}
          >
            Explorar Eventos
          </Link>

          {usuarioActual && (
            <>
              <Link
                to="/crear-evento"
                className={`nav-link ${
                  ubicacion.pathname === '/crear-evento' ? 'active' : ''
                }`}
              >
                + Publicar Evento
              </Link>

              <Link
                to="/perfil"
                className={`nav-link ${
                  ubicacion.pathname === '/perfil' ? 'active' : ''
                }`}
              >
                Mi Perfil
              </Link>
            </>
          )}
        </div>

        {usuarioActual && (
          <div className="user-controls">
            <div className="user-selector">
              <label htmlFor="user-select">Sesión:</label>
              <select
                id="user-select"
                value={usuarioActual.id || usuarioActual.id_usuario || ''}
                onChange={(evento) => cambiarUsuario(evento.target.value)}
              >
                {usuariosDisponibles.map((usuario) => {
                  const idUsuario = usuario.id || usuario.id_usuario;
                  return (
                    <option key={idUsuario} value={idUsuario}>
                      {usuario.nombre} (@{usuario.apodo})
                    </option>
                  );
                })}
              </select>
              {usuarioActual?.fotoPerfil && (
                <img
                  src={usuarioActual.fotoPerfil}
                  alt={usuarioActual.apodo}
                  className="nav-avatar"
                />
              )}
            </div>

            <button onClick={manejarCerrarSesion} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

// Alias de compatibilidad
export const Navbar = BarraNavegacion;
