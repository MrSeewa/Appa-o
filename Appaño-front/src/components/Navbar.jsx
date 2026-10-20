import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../context/AuthContext';

export const BarraNavegacion = () => {
  const { usuarioActual } = useAutenticacion();
  const ubicacion = useLocation();
  const navegar = useNavigate();

  const [textoBusqueda, setTextoBusqueda] = useState('');

  const manejarEnvioBusqueda = (evento) => {
    evento.preventDefault();
    if (textoBusqueda.trim()) {
      navegar(`/buscar?q=${encodeURIComponent(textoBusqueda.trim())}`);
    } else {
      navegar('/buscar');
    }
  };

  const inicialApodo = usuarioActual?.apodo
    ? usuarioActual.apodo.charAt(0).toUpperCase()
    : 'U';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <span className="brand-text">Yo Appaño</span>
          <span className="brand-badge">metro</span>
        </Link>

        {/* Formulario de Búsqueda Rápida en la Barra de Navegación */}
        {usuarioActual && (
          <form onSubmit={manejarEnvioBusqueda} className="nav-search-form">
            <input
              type="text"
              placeholder="Buscar usuarios o eventos..."
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              className="nav-search-input"
            />
            <button type="submit" className="nav-search-btn" title="Buscar">
              Buscar
            </button>
          </form>
        )}

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
        </div>

        {usuarioActual && (
          <div className="user-controls">
            <Link
              to="/perfil"
              className={`nav-user-chip ${
                ubicacion.pathname.startsWith('/perfil') ? 'active' : ''
              }`}
              title="Ver mi perfil"
            >
              {usuarioActual.fotoPerfil ? (
                <img
                  src={usuarioActual.fotoPerfil}
                  alt={usuarioActual.apodo}
                  className="nav-avatar"
                />
              ) : (
                <div className="nav-avatar-placeholder">
                  {inicialApodo}
                </div>
              )}
              <span className="nav-user-name">@{usuarioActual.apodo || usuarioActual.nombre}</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

// Alias de compatibilidad
export const Navbar = BarraNavegacion;
export default BarraNavegacion;
