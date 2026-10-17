import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { usuarioActual, usuariosDisponibles, cambiarUsuario, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    // 1. Destruimos la sesión local mediante el AuthContext
    logout();

    // 2. Redirigimos al login limpiando el historial de navegación
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <span className="brand-badge">🤝</span>
          <span className="brand-text">Appaño</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${
              location.pathname === '/' || location.pathname === '/eventos'
                ? 'active'
                : ''
            }`}
          >
            Explorar Eventos
          </Link>

          {usuarioActual && (
            <Link
              to="/crear-evento"
              className={`nav-link ${
                location.pathname === '/crear-evento' ? 'active' : ''
              }`}
            >
              + Publicar Evento
            </Link>
          )}
        </div>

        {usuarioActual && (
          <div className="user-controls">
            <div className="user-selector">
              <label htmlFor="user-select">Sesión:</label>
              <select
                id="user-select"
                value={usuarioActual.id || usuarioActual.id_usuario || ''}
                onChange={(e) => cambiarUsuario(e.target.value)}
              >
                {usuariosDisponibles.map((u) => {
                  const id = u.id || u.id_usuario;
                  return (
                    <option key={id} value={id}>
                      {u.nombre} (@{u.apodo})
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

            <button onClick={handleCerrarSesion} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
