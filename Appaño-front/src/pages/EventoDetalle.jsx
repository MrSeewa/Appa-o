import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicioEvento } from '../services/eventoService';
import { useAutenticacion } from '../context/AuthContext';

export const DetalleEvento = () => {
  const { id } = useParams();
  const { usuarioActual } = useAutenticacion();

  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [inscribiendo, setInscribiendo] = useState(false);
  const [mensajeInscripcion, setMensajeInscripcion] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState(null); // 'success' | 'error'

  const cargarEvento = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await servicioEvento.obtenerPorId(id);
      setEvento(datos);
    } catch (errorPeticion) {
      console.error('Error al cargar detalle del evento:', errorPeticion);
      setError(
        errorPeticion.response?.data?.mensaje ||
          'No se pudo encontrar el evento solicitado o falló la conexión.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEvento();
  }, [id]);

  const manejarInscribirse = async () => {
    if (!usuarioActual) {
      setMensajeInscripcion('Debes tener un usuario activo para inscribirte.');
      setTipoMensaje('error');
      return;
    }

    setInscribiendo(true);
    setMensajeInscripcion(null);

    const idUsuario = usuarioActual.id || usuarioActual.id_usuario;

    try {
      await servicioEvento.inscribirUsuario(id, idUsuario);
      setMensajeInscripcion(
        `¡Felicitaciones ${usuarioActual.nombre}! Te has inscrito exitosamente en este evento.`
      );
      setTipoMensaje('success');

      // Actualizar el contador localmente
      setEvento((estadoPrevio) => ({
        ...estadoPrevio,
        cantidadInscritos: Number(estadoPrevio.cantidadInscritos || 0) + 1,
      }));
    } catch (errorPeticion) {
      console.error('Error al inscribirse:', errorPeticion);
      const mensajeError =
        errorPeticion.response?.data?.mensaje ||
        'No fue posible completar la inscripción. Quizás ya estés registrado.';
      setMensajeInscripcion(mensajeError);
      setTipoMensaje('error');
    } finally {
      setInscribiendo(false);
    }
  };

  if (cargando) {
    return (
      <div className="detalle-container state-box">
        <div className="spinner"></div>
        <p>Cargando detalles del evento...</p>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="detalle-container state-box error-box">
        <h2>Ups, ocurrió un problema</h2>
        <p>{error || 'El evento no existe.'}</p>
        <Link to="/" className="btn-primary">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  const fechaFormateada = evento.fechaEvento
    ? new Date(evento.fechaEvento).toLocaleString('es-CL', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : 'Por definir';

  const creador = evento.creador || {};

  return (
    <div className="detalle-container">
      <div className="detalle-nav-top">
        <Link to="/" className="btn-back">
          ← Volver a los eventos
        </Link>
        <span className="categoria-pill">{evento.categoria || 'General'}</span>
      </div>

      <div className="detalle-card">
        <h1 className="detalle-titulo">{evento.titulo}</h1>

        <div className="detalle-stats-bar">
          <div className="stat-item">
            <span className="stat-label">Fecha y Hora</span>
            <span className="stat-value">{fechaFormateada}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Asistentes Confirmados</span>
            <span className="stat-value highlight">
              {evento.cantidadInscritos} {evento.cantidadInscritos === 1 ? 'persona' : 'personas'}
            </span>
          </div>
        </div>

        <div className="detalle-cuerpo">
          <h3>Descripción del Evento</h3>
          <p className="detalle-descripcion">{evento.descripcion}</p>
        </div>

        {/* Sección del Creador (viene de Feign) */}
        <div className="creador-panel">
          <h3>Organizado por</h3>
          <div className="creador-info-card">
            {creador.fotoPerfil ? (
              <img
                src={creador.fotoPerfil}
                alt={creador.apodo}
                className="creador-avatar-large"
              />
            ) : (
              <div className="creador-avatar-placeholder large">
                {creador.apodo ? creador.apodo.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="creador-datos">
              <h4>
                {creador.nombre || 'Nombre no disponible'}{' '}
                <span className="creador-apodo-tag">@{creador.apodo || 'anónimo'}</span>
              </h4>
              <p className="creador-bio">
                {creador.biografia || 'Sin biografía disponible.'}
              </p>
              {creador.correo && (
                <span className="creador-correo">{creador.correo}</span>
              )}
            </div>
          </div>
        </div>

        {/* Acción de Inscripción */}
        <div className="inscripcion-panel">
          <div className="inscripcion-header">
            <div>
              <h3>¿Te apañas a asistir?</h3>
              <p>
                Inscríbete como <strong>{usuarioActual?.nombre}</strong> (@{usuarioActual?.apodo})
              </p>
            </div>
            <button
              onClick={manejarInscribirse}
              disabled={inscribiendo}
              className="btn-inscribir"
            >
              {inscribiendo ? 'Inscribiendo...' : '¡Añáñame! (Inscribirme)'}
            </button>
          </div>

          {mensajeInscripcion && (
            <div className={`alert-box ${tipoMensaje}`}>
              {mensajeInscripcion}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Alias de compatibilidad
export const EventoDetalle = DetalleEvento;
