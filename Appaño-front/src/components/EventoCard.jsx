import React from 'react';
import { Link } from 'react-router-dom';

export const EventoCard = ({ evento }) => {
  const fecha = evento.fechaEvento
    ? new Date(evento.fechaEvento).toLocaleDateString('es-CL', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Fecha por definir';

  return (
    <div className="evento-card">
      <div className="card-header">
        <span className="categoria-pill">{evento.categoria || 'General'}</span>
        <span className="inscritos-badge">
          👥 {evento.cantidadInscritos ?? 0} {evento.cantidadInscritos === 1 ? 'inscrito' : 'inscritos'}
        </span>
      </div>

      <h3 className="card-title">{evento.titulo}</h3>
      <p className="card-desc">
        {evento.descripcion?.length > 120
          ? `${evento.descripcion.substring(0, 120)}...`
          : evento.descripcion}
      </p>

      <div className="card-meta">
        <div className="fecha-box">
          <span className="meta-icon">📅</span>
          <span>{fecha}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="creador-box">
          {evento.creador?.fotoPerfil ? (
            <img
              src={evento.creador.fotoPerfil}
              alt={evento.creador.apodo}
              className="creador-avatar-small"
            />
          ) : (
            <div className="creador-avatar-placeholder">
              {evento.creador?.apodo ? evento.creador.apodo.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <span className="creador-apodo">@{evento.creador?.apodo || 'anónimo'}</span>
        </div>

        <Link to={`/eventos/${evento.id}`} className="btn-ver-detalle">
          Ver detalles →
        </Link>
      </div>
    </div>
  );
};

