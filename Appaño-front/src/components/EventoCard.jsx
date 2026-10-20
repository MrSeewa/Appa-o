import React from 'react';
import { Link } from 'react-router-dom';
import { useAutenticacion } from '../context/AuthContext';

export const TarjetaEvento = ({ evento, puedeEditar }) => {
  const { usuarioActual } = useAutenticacion();

  const fechaFormateada = evento.fechaEvento
    ? new Date(evento.fechaEvento).toLocaleDateString('es-CL', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Fecha por definir';

  const inicialApodo = evento.creador?.apodo
    ? evento.creador.apodo.charAt(0).toUpperCase()
    : 'U';

  const esPasado = evento.fechaEvento
    ? new Date(evento.fechaEvento).getTime() < Date.now()
    : false;

  const idUsuarioActual = usuarioActual?.id || usuarioActual?.id_usuario;
  const idCreador = evento.creadorId || evento.creador?.id || evento.creador?.id_usuario;
  const esMio = puedeEditar || (idUsuarioActual && idCreador && Number(idUsuarioActual) === Number(idCreador));

  return (
    <div className={`evento-card ${esPasado ? 'evento-pasado' : ''}`}>
      <div className="card-header">
        <div className="card-etiquetas">
          <span className="categoria-pill">{evento.categoria || 'General'}</span>
          {esPasado ? (
            <span className="estado-badge finalizado">Finalizado</span>
          ) : (
            <span className="estado-badge proximo">Próximo</span>
          )}
        </div>
        <span className="inscritos-badge">
          {evento.cantidadInscritos ?? 0} {evento.cantidadInscritos === 1 ? 'inscrito' : 'inscritos'}
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
          <span>{fechaFormateada}</span>
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
              {inicialApodo}
            </div>
          )}
          <span className="creador-apodo">@{evento.creador?.apodo || 'anónimo'}</span>
        </div>

        <div className="card-acciones" style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
          {esMio && (
            <Link to={`/eventos/${evento.id}/editar`} className="btn-editar-mini">
              Modificar
            </Link>
          )}
          <Link to={`/eventos/${evento.id}`} className="btn-ver-detalle">
            Ver detalles →
          </Link>
        </div>
      </div>
    </div>
  );
};

// Alias de compatibilidad
export const EventoCard = TarjetaEvento;
