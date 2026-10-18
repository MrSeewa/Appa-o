import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAutenticacion } from '../context/AuthContext';
import { servicioUsuario } from '../services/usuarioService';
import { servicioEvento } from '../services/eventoService';
import { TarjetaEvento } from '../components/EventoCard';
import { SubirFotoPerfil } from '../components/SubirFotoPerfil';

export const Perfil = () => {
  const { usuarioActual, actualizarDatosSesion } = useAutenticacion();

  // Pestana activa: 'datos' | 'eventos' | 'inscripciones' | 'ajustes'
  const [pestanaActiva, setPestanaActiva] = useState('datos');

  // Estado del formulario de edicion de perfil
  const [formulario, setFormulario] = useState({
    nombre: '',
    apodo: '',
    correo: '',
    biografia: '',
    fotoPerfil: '',
  });

  // Eventos creados por este usuario
  const [misEventos, setMisEventos] = useState([]);
  const [cargandoEventos, setCargandoEventos] = useState(false);

  // Estados de retroalimentacion
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [mensajeError, setMensajeError] = useState(null);

  // Sincronizar el formulario cuando cambie el usuario actual
  useEffect(() => {
    if (usuarioActual) {
      setFormulario({
        nombre: usuarioActual.nombre || '',
        apodo: usuarioActual.apodo || '',
        correo: usuarioActual.correo || '',
        biografia: usuarioActual.biografia || '',
        fotoPerfil: usuarioActual.fotoPerfil || '',
      });
      cargarMisEventos();
    }
  }, [usuarioActual]);

  const cargarMisEventos = async () => {
    if (!usuarioActual) return;
    setCargandoEventos(true);
    try {
      const todosLosEventos = await servicioEvento.obtenerTodos();
      const idUsuario = usuarioActual.id || usuarioActual.id_usuario;

      // Filtrar los eventos donde el creador coincida con el usuario actual
      const filtrados = todosLosEventos.filter(
        (ev) => ev.creadorId === idUsuario || ev.creador?.id === idUsuario || ev.creador?.id_usuario === idUsuario
      );
      setMisEventos(filtrados);
    } catch (error) {
      console.error('Error al cargar eventos del usuario:', error);
    } finally {
      setCargandoEventos(false);
    }
  };

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((estadoPrevio) => ({
      ...estadoPrevio,
      [name]: value,
    }));
  };

  const manejarGuardar = async (evento) => {
    evento.preventDefault();
    setGuardando(true);
    setMensajeExito(null);
    setMensajeError(null);

    const idUsuario = usuarioActual.id || usuarioActual.id_usuario;

    try {
      const usuarioActualizado = await servicioUsuario.actualizar(idUsuario, formulario);
      actualizarDatosSesion(usuarioActualizado);
      setMensajeExito('Tu información de perfil se actualizó correctamente.');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      let mensaje = 'No se pudo actualizar el perfil. Intenta nuevamente.';
      const datosError = error.response?.data;
      if (datosError?.errores && typeof datosError.errores === 'object') {
        mensaje = Object.values(datosError.errores).join('. ');
      } else if (datosError?.mensaje) {
        mensaje = datosError.mensaje;
      } else if (datosError?.detalle) {
        mensaje = datosError.detalle;
      }
      setMensajeError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const manejarFotoSubida = (nuevaUrl) => {
    setFormulario((estadoPrevio) => ({
      ...estadoPrevio,
      fotoPerfil: nuevaUrl,
    }));
    actualizarDatosSesion({
      ...usuarioActual,
      fotoPerfil: nuevaUrl,
    });
    setMensajeExito('Tu nueva foto de perfil ha sido subida y guardada correctamente.');
  };

  if (!usuarioActual) {
    return (
      <div className="state-box" style={{ maxWidth: '450px', margin: '4rem auto' }}>
        <p>No hay una sesión activa para mostrar el perfil.</p>
        <Link to="/login" className="btn-primary" style={{ marginTop: '1rem' }}>
          Ir a Iniciar Sesión
        </Link>
      </div>
    );
  }

  const inicialApodo = usuarioActual.apodo
    ? usuarioActual.apodo.charAt(0).toUpperCase()
    : 'U';

  const fechaMiembro = usuarioActual.fechaRegistro
    ? new Date(usuarioActual.fechaRegistro).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Registro reciente';

  return (
    <div className="perfil-container">
      {/* Cabecera del Perfil con Banner y Avatar */}
      <div className="perfil-card perfil-hero">
        <div className="perfil-avatar-container">
          {usuarioActual.fotoPerfil ? (
            <img
              src={usuarioActual.fotoPerfil}
              alt={usuarioActual.apodo}
              className="perfil-avatar-img"
            />
          ) : (
            <div className="perfil-avatar-placeholder">
              {inicialApodo}
            </div>
          )}
        </div>

        <div className="perfil-hero-info">
          <div className="perfil-hero-header">
            <h2>{usuarioActual.nombre}</h2>
            <span className="rol-badge">{usuarioActual.rol || 'USER'}</span>
          </div>
          <p className="perfil-apodo-tag">@{usuarioActual.apodo}</p>
          <p className="perfil-meta-sub">
            Miembro desde el {fechaMiembro} • ID: {usuarioActual.id || usuarioActual.id_usuario}
          </p>
          <p className="perfil-bio-preview">
            {usuarioActual.biografia || 'Sin biografía escrita aún.'}
          </p>
        </div>
      </div>

      {/* Navegacion por Pestanas */}
      <div className="perfil-tabs">
        <button
          className={`perfil-tab-btn ${pestanaActiva === 'datos' ? 'active' : ''}`}
          onClick={() => setPestanaActiva('datos')}
        >
          Mis Datos Personales
        </button>

        <button
          className={`perfil-tab-btn ${pestanaActiva === 'eventos' ? 'active' : ''}`}
          onClick={() => setPestanaActiva('eventos')}
        >
          Mis Eventos Creados ({misEventos.length})
        </button>

        <button
          className={`perfil-tab-btn ${pestanaActiva === 'inscripciones' ? 'active' : ''}`}
          onClick={() => setPestanaActiva('inscripciones')}
        >
          Historial de Asistencias
        </button>

        <button
          className={`perfil-tab-btn ${pestanaActiva === 'ajustes' ? 'active' : ''}`}
          onClick={() => setPestanaActiva('ajustes')}
        >
          Ajustes y Seguridad
        </button>
      </div>

      {/* Contenido de la Pestana: Datos Personales */}
      {pestanaActiva === 'datos' && (
        <div className="perfil-card">
          <div className="perfil-section-header">
            <h3>Información de tu Perfil</h3>
            <p>Edita tus datos básicos para que otros usuarios de la comunidad puedan reconocerte.</p>
          </div>

          {mensajeExito && <div className="alert-box success">{mensajeExito}</div>}
          {mensajeError && <div className="alert-box error">{mensajeError}</div>}

          {/* Componente para subir foto de perfil como archivo fisico */}
          <SubirFotoPerfil
            idUsuario={usuarioActual.id || usuarioActual.id_usuario}
            fotoActual={formulario.fotoPerfil}
            alSubirExitoso={manejarFotoSubida}
          />

          <form onSubmit={manejarGuardar} className="perfil-form" style={{ marginTop: '2rem' }}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre Completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  value={formulario.nombre}
                  onChange={manejarCambio}
                />
              </div>

              <div className="form-group">
                <label htmlFor="apodo">Apodo o Usuario *</label>
                <input
                  type="text"
                  id="apodo"
                  name="apodo"
                  required
                  value={formulario.apodo}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="correo">Correo Electrónico *</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  required
                  value={formulario.correo}
                  onChange={manejarCambio}
                />
              </div>

              <div className="form-group">
                <label htmlFor="fotoPerfil">URL Foto de Perfil</label>
                <input
                  type="url"
                  id="fotoPerfil"
                  name="fotoPerfil"
                  placeholder="https://ejemplo.com/mifoto.jpg"
                  value={formulario.fotoPerfil}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="biografia">Biografía / Presentación</label>
              <textarea
                id="biografia"
                name="biografia"
                rows={4}
                maxLength={500}
                placeholder="Cuéntale al resto sobre tus intereses, tus deportes favoritos o qué te motiva a organizar actividades..."
                value={formulario.biografia}
                onChange={manejarCambio}
              />
              <span className="caracteres-info">
                {formulario.biografia.length} / 500 caracteres
              </span>
            </div>

            <div className="perfil-form-actions">
              <button
                type="submit"
                disabled={guardando}
                className="btn-primary"
              >
                {guardando ? 'Guardando cambios...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contenido de la Pestana: Mis Eventos Creados */}
      {pestanaActiva === 'eventos' && (
        <div className="perfil-card">
          <div className="perfil-section-header">
            <h3>Eventos que has publicado</h3>
            <p>Monitorea la cantidad de participantes y revisa los detalles de tus actividades organizadas.</p>
          </div>

          {cargandoEventos && (
            <div className="state-box">
              <div className="spinner"></div>
              <p>Cargando tus eventos...</p>
            </div>
          )}

          {!cargandoEventos && misEventos.length === 0 && (
            <div className="state-box empty-box">
              <p>Aún no has organizado ningún evento.</p>
              <Link to="/crear-evento" className="btn-primary" style={{ marginTop: '1rem' }}>
                Publicar mi primer evento
              </Link>
            </div>
          )}

          {!cargandoEventos && misEventos.length > 0 && (
            <div className="eventos-grid" style={{ marginTop: '1.5rem' }}>
              {misEventos.map((ev) => (
                <TarjetaEvento key={ev.id} evento={ev} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contenido de la Pestana: Historial de Asistencias (A futuro) */}
      {pestanaActiva === 'inscripciones' && (
        <div className="perfil-card">
          <div className="perfil-section-header">
            <h3>Historial de Asistencias e Inscripciones</h3>
            <p>Aquí se listarán todos los eventos a los que te has sumado en la comunidad.</p>
          </div>

          <div className="state-box futuro-box">
            <h4>Módulo en desarrollo</h4>
            <p>
              Actualmente las inscripciones se guardan en la base de datos de eventos (tabla inscripciones).
              Pronto podrás ver aquí tu lista completa de actividades pasadas y futuras, confirmar asistencia y descargar recordatorios.
            </p>
            <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>
              Explorar eventos disponibles para asistir
            </Link>
          </div>
        </div>
      )}

      {/* Contenido de la Pestana: Ajustes y Seguridad (A futuro) */}
      {pestanaActiva === 'ajustes' && (
        <div className="perfil-card">
          <div className="perfil-section-header">
            <h3>Ajustes de Cuenta y Seguridad</h3>
            <p>Administra tu contraseña, privacidad y configuración de notificaciones.</p>
          </div>

          <div className="ajustes-grid">
            <div className="ajuste-card">
              <h4>Cambio de Contraseña</h4>
              <p>Configura una nueva contraseña segura para tu cuenta.</p>
              <button disabled className="btn-filtro" style={{ cursor: 'not-allowed', marginTop: '0.5rem' }}>
                Próximamente con Spring Security
              </button>
            </div>

            <div className="ajuste-card">
              <h4>Notificaciones por Correo</h4>
              <p>Decide si deseas recibir alertas cuando alguien se inscriba a tus eventos.</p>
              <button disabled className="btn-filtro" style={{ cursor: 'not-allowed', marginTop: '0.5rem' }}>
                Próximamente
              </button>
            </div>

            <div className="ajuste-card peligro">
              <h4 style={{ color: '#dc2626' }}>Zona de Peligro</h4>
              <p>Eliminar permanentemente tu cuenta y desasociar tus datos.</p>
              <button disabled className="btn-filtro" style={{ cursor: 'not-allowed', marginTop: '0.5rem', color: '#dc2626' }}>
                Deshabilitado temporalmente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Alias de compatibilidad
export const PerfilUsuario = Perfil;
export default Perfil;

