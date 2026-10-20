import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../context/AuthContext';
import { servicioUsuario } from '../services/usuarioService';
import { servicioEvento } from '../services/eventoService';
import { TarjetaEvento } from '../components/EventoCard';
import { SubirFotoPerfil } from '../components/SubirFotoPerfil';

export const Perfil = () => {
  const { id: idUrl } = useParams();
  const { usuarioActual, actualizarDatosSesion, cerrarSesion } = useAutenticacion();
  const navegar = useNavigate();

  const idUsuarioActual = usuarioActual?.id || usuarioActual?.id_usuario;
  const esPropioPerfil = !idUrl || Number(idUrl) === Number(idUsuarioActual);

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navegar('/login', { replace: true });
  };

  // Pestaña activa: 'datos' | 'eventos' | 'inscripciones' | 'ajustes'
  const [pestanaActiva, setPestanaActiva] = useState(esPropioPerfil ? 'datos' : 'eventos');

  // Usuario que se está visualizando (propio o de otro miembro)
  const [usuarioVisualizado, setUsuarioVisualizado] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);

  // Estado del formulario de edición de perfil (solo si es perfil propio)
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
  const [filtroEventosCreados, setFiltroEventosCreados] = useState('todos');

  // Eventos a los que este usuario se ha inscrito
  const [misInscripciones, setMisInscripciones] = useState([]);
  const [cargandoInscripciones, setCargandoInscripciones] = useState(false);
  const [filtroInscripciones, setFiltroInscripciones] = useState('todos');

  // Estados de retroalimentación
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [mensajeError, setMensajeError] = useState(null);

  // Cargar información del usuario según si es perfil propio o de otro
  useEffect(() => {
    const cargarDatosPerfil = async () => {
      setCargandoUsuario(true);
      if (esPropioPerfil) {
        if (usuarioActual) {
          setUsuarioVisualizado(usuarioActual);
          setFormulario({
            nombre: usuarioActual.nombre || '',
            apodo: usuarioActual.apodo || '',
            correo: usuarioActual.correo || '',
            biografia: usuarioActual.biografia || '',
            fotoPerfil: usuarioActual.fotoPerfil || '',
          });
          cargarEventosDeUsuario(idUsuarioActual);
          cargarInscripcionesDeUsuario(idUsuarioActual);
        }
        setCargandoUsuario(false);
      } else {
        try {
          const usuarioExterno = await servicioUsuario.obtenerPorId(idUrl);
          setUsuarioVisualizado(usuarioExterno);
          setPestanaActiva('eventos');
          cargarEventosDeUsuario(idUrl);
          cargarInscripcionesDeUsuario(idUrl);
        } catch (errorCarga) {
          console.error('Error cargando usuario externo:', errorCarga);
          setMensajeError('No se pudo cargar el perfil del usuario solicitado.');
        } finally {
          setCargandoUsuario(false);
        }
      }
    };

    cargarDatosPerfil();
  }, [idUrl, usuarioActual, esPropioPerfil]);

  const cargarEventosDeUsuario = async (idObjetivo) => {
    if (!idObjetivo) return;
    setCargandoEventos(true);
    try {
      const todosLosEventos = await servicioEvento.obtenerTodos();

      // Filtrar los eventos creados por el usuario objetivo
      const filtrados = todosLosEventos.filter(
        (ev) =>
          Number(ev.creadorId) === Number(idObjetivo) ||
          Number(ev.creador?.id) === Number(idObjetivo) ||
          Number(ev.creador?.id_usuario) === Number(idObjetivo)
      );

      // Ordenar cronológicamente (más recientes primero)
      filtrados.sort((a, b) => {
        const tiempoA = a.fechaEvento ? new Date(a.fechaEvento).getTime() : 0;
        const tiempoB = b.fechaEvento ? new Date(b.fechaEvento).getTime() : 0;
        return tiempoB - tiempoA;
      });

      setMisEventos(filtrados);
    } catch (error) {
      console.error('Error al cargar eventos del usuario:', error);
    } finally {
      setCargandoEventos(false);
    }
  };

  const cargarInscripcionesDeUsuario = async (idObjetivo) => {
    if (!idObjetivo) return;
    setCargandoInscripciones(true);
    try {
      const inscritos = await servicioEvento.obtenerInscripcionesUsuario(idObjetivo);

      // Ordenar cronológicamente (más recientes primero)
      const listaInscritos = [...(inscritos || [])];
      listaInscritos.sort((a, b) => {
        const tiempoA = a.fechaEvento ? new Date(a.fechaEvento).getTime() : 0;
        const tiempoB = b.fechaEvento ? new Date(b.fechaEvento).getTime() : 0;
        return tiempoB - tiempoA;
      });

      setMisInscripciones(listaInscritos);
    } catch (error) {
      console.error('Error al cargar historial de inscripciones:', error);
    } finally {
      setCargandoInscripciones(false);
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
    if (!esPropioPerfil) return;

    setGuardando(true);
    setMensajeExito(null);
    setMensajeError(null);

    const idUsuario = usuarioActual.id || usuarioActual.id_usuario;

    try {
      const usuarioActualizado = await servicioUsuario.actualizar(idUsuario, formulario);
      actualizarDatosSesion(usuarioActualizado);
      setUsuarioVisualizado(usuarioActualizado);
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
    setUsuarioVisualizado((prev) => ({
      ...prev,
      fotoPerfil: nuevaUrl,
    }));
    setMensajeExito('Tu nueva foto de perfil ha sido subida y guardada correctamente.');
  };

  if (cargandoUsuario) {
    return (
      <div className="state-box" style={{ maxWidth: '450px', margin: '4rem auto' }}>
        <div className="spinner"></div>
        <p>Cargando información del perfil...</p>
      </div>
    );
  }

  if (!usuarioVisualizado) {
    return (
      <div className="state-box error-box" style={{ maxWidth: '450px', margin: '4rem auto' }}>
        <p>{mensajeError || 'No se encontró el usuario solicitado.'}</p>
        <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  const inicialApodo = usuarioVisualizado.apodo
    ? usuarioVisualizado.apodo.charAt(0).toUpperCase()
    : 'U';

  const fechaMiembro = usuarioVisualizado.fechaRegistro
    ? new Date(usuarioVisualizado.fechaRegistro).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Registro reciente';

  // Cálculos para eventos creados
  const eventosCreadosVigentes = misEventos.filter(
    (ev) => !ev.fechaEvento || new Date(ev.fechaEvento).getTime() >= Date.now()
  );
  const eventosCreadosPasados = misEventos.filter(
    (ev) => ev.fechaEvento && new Date(ev.fechaEvento).getTime() < Date.now()
  );
  const eventosCreadosMostrar =
    filtroEventosCreados === 'vigentes'
      ? eventosCreadosVigentes
      : filtroEventosCreados === 'pasados'
      ? eventosCreadosPasados
      : misEventos;

  // Cálculos para asistencias e inscripciones del usuario
  const inscripcionesProximas = misInscripciones.filter(
    (ev) => !ev.fechaEvento || new Date(ev.fechaEvento).getTime() >= Date.now()
  );
  const inscripcionesPasadas = misInscripciones.filter(
    (ev) => ev.fechaEvento && new Date(ev.fechaEvento).getTime() < Date.now()
  );
  const inscripcionesMostrar =
    filtroInscripciones === 'proximos'
      ? inscripcionesProximas
      : filtroInscripciones === 'pasados'
      ? inscripcionesPasadas
      : misInscripciones;

  return (
    <div className="perfil-container">
      {/* Cabecera del Perfil con Banner y Avatar */}
      <div className="perfil-card perfil-hero">
        <div className="perfil-avatar-container">
          {usuarioVisualizado.fotoPerfil ? (
            <img
              src={usuarioVisualizado.fotoPerfil}
              alt={usuarioVisualizado.apodo}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <h2>{usuarioVisualizado.nombre}</h2>
              <span className="rol-badge">{usuarioVisualizado.rol || 'USER'}</span>
              {!esPropioPerfil && (
                <span className="perfil-tag-comunidad">Miembro de Yo Appaño</span>
              )}
            </div>

            {esPropioPerfil && (
              <button
                onClick={manejarCerrarSesion}
                className="btn-logout"
                title="Cerrar sesión activa en este dispositivo"
              >
                Cerrar Sesión
              </button>
            )}
          </div>
          <p className="perfil-apodo-tag">@{usuarioVisualizado.apodo}</p>
          <p className="perfil-meta-sub">
            Miembro desde el {fechaMiembro} • ID: {usuarioVisualizado.id || usuarioVisualizado.id_usuario}
          </p>
          <p className="perfil-bio-preview">
            {usuarioVisualizado.biografia || 'Sin biografía escrita aún.'}
          </p>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <div className="perfil-tabs">
        {esPropioPerfil && (
          <button
            className={`perfil-tab-btn ${pestanaActiva === 'datos' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('datos')}
          >
            Mis Datos Personales
          </button>
        )}

        <button
          className={`perfil-tab-btn ${pestanaActiva === 'eventos' ? 'active' : ''}`}
          onClick={() => setPestanaActiva('eventos')}
        >
          {esPropioPerfil ? 'Mis Eventos Creados' : 'Eventos Publicados'} ({misEventos.length})
        </button>

        <button
          className={`perfil-tab-btn ${pestanaActiva === 'inscripciones' ? 'active' : ''}`}
          onClick={() => setPestanaActiva('inscripciones')}
        >
          {esPropioPerfil ? 'Historial de Asistencias' : 'Asistencias'} ({misInscripciones.length})
        </button>

        {esPropioPerfil && (
          <button
            className={`perfil-tab-btn ${pestanaActiva === 'ajustes' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('ajustes')}
          >
            Ajustes y Seguridad
          </button>
        )}
      </div>

      {/* Contenido de la Pestaña: Datos Personales (Solo para perfil propio) */}
      {esPropioPerfil && pestanaActiva === 'datos' && (
        <div className="perfil-card">
          <div className="perfil-section-header">
            <h3>Información de tu Perfil</h3>
            <p>Edita tus datos básicos para que otros usuarios de la comunidad puedan reconocerte.</p>
          </div>

          {mensajeExito && <div className="alert-box success">{mensajeExito}</div>}
          {mensajeError && <div className="alert-box error">{mensajeError}</div>}

          {/* Componente para subir foto de perfil como archivo físico */}
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

      {/* Contenido de la Pestaña: Eventos Creados / Publicados */}
      {pestanaActiva === 'eventos' && (
        <div className="perfil-card">
          <div className="perfil-section-header">
            <h3>{esPropioPerfil ? 'Historial de Eventos Publicados' : `Eventos organizados por ${usuarioVisualizado.nombre}`}</h3>
            <p>
              {esPropioPerfil
                ? 'Monitorea tus actividades pasadas y próximas. Tus eventos creados permanecen en tu historial aunque ya haya pasado su fecha.'
                : 'Actividades que este usuario ha organizado en la plataforma.'}
            </p>
          </div>

          {cargandoEventos && (
            <div className="state-box">
              <div className="spinner"></div>
              <p>Cargando eventos...</p>
            </div>
          )}

          {!cargandoEventos && misEventos.length === 0 && (
            <div className="state-box empty-box">
              <p>{esPropioPerfil ? 'Aún no has organizado ningún evento.' : 'Este usuario aún no ha organizado ningún evento.'}</p>
              {esPropioPerfil && (
                <Link to="/crear-evento" className="btn-primary" style={{ marginTop: '1rem' }}>
                  Publicar mi primer evento
                </Link>
              )}
            </div>
          )}

          {!cargandoEventos && misEventos.length > 0 && (
            <>
              <div className="filtro-categorias" style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
                <button
                  className={`btn-filtro ${filtroEventosCreados === 'todos' ? 'active' : ''}`}
                  onClick={() => setFiltroEventosCreados('todos')}
                >
                  Todos ({misEventos.length})
                </button>
                <button
                  className={`btn-filtro ${filtroEventosCreados === 'vigentes' ? 'active' : ''}`}
                  onClick={() => setFiltroEventosCreados('vigentes')}
                >
                  Próximos ({eventosCreadosVigentes.length})
                </button>
                <button
                  className={`btn-filtro ${filtroEventosCreados === 'pasados' ? 'active' : ''}`}
                  onClick={() => setFiltroEventosCreados('pasados')}
                >
                  Finalizados ({eventosCreadosPasados.length})
                </button>
              </div>

              {eventosCreadosMostrar.length === 0 ? (
                <div className="state-box empty-box">
                  <p>No hay eventos registrados bajo este filtro.</p>
                </div>
              ) : (
                <div className="eventos-grid">
                  {eventosCreadosMostrar.map((ev) => (
                    <TarjetaEvento key={ev.id} evento={ev} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Contenido de la Pestaña: Historial de Asistencias e Inscripciones */}
      {pestanaActiva === 'inscripciones' && (
        <div className="perfil-card">
          <div className="perfil-section-header">
            <h3>{esPropioPerfil ? 'Historial de Asistencias e Inscripciones' : `Inscripciones de ${usuarioVisualizado.nombre}`}</h3>
            <p>
              {esPropioPerfil
                ? 'Revisa todos los eventos en los que te has inscrito para participar en la comunidad.'
                : 'Eventos de la comunidad a los que este usuario asiste o ha asistido.'}
            </p>
          </div>

          {cargandoInscripciones && (
            <div className="state-box">
              <div className="spinner"></div>
              <p>Cargando historial de asistencias...</p>
            </div>
          )}

          {!cargandoInscripciones && misInscripciones.length === 0 && (
            <div className="state-box empty-box">
              <p>{esPropioPerfil ? 'Aún no te has inscrito a ningún evento.' : 'Este usuario no tiene inscripciones registradas.'}</p>
              {esPropioPerfil && (
                <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>
                  Explorar eventos disponibles
                </Link>
              )}
            </div>
          )}

          {!cargandoInscripciones && misInscripciones.length > 0 && (
            <>
              <div className="filtro-categorias" style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
                <button
                  className={`btn-filtro ${filtroInscripciones === 'todos' ? 'active' : ''}`}
                  onClick={() => setFiltroInscripciones('todos')}
                >
                  Todas ({misInscripciones.length})
                </button>
                <button
                  className={`btn-filtro ${filtroInscripciones === 'proximos' ? 'active' : ''}`}
                  onClick={() => setFiltroInscripciones('proximos')}
                >
                  Por asistir ({inscripcionesProximas.length})
                </button>
                <button
                  className={`btn-filtro ${filtroInscripciones === 'pasados' ? 'active' : ''}`}
                  onClick={() => setFiltroInscripciones('pasados')}
                >
                  Finalizados ({inscripcionesPasadas.length})
                </button>
              </div>

              {inscripcionesMostrar.length === 0 ? (
                <div className="state-box empty-box">
                  <p>No hay asistencias registradas bajo este filtro.</p>
                </div>
              ) : (
                <div className="eventos-grid">
                  {inscripcionesMostrar.map((ev) => (
                    <TarjetaEvento key={ev.id} evento={ev} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Contenido de la Pestaña: Ajustes y Seguridad (Solo para perfil propio) */}
      {esPropioPerfil && pestanaActiva === 'ajustes' && (
        <div className="perfil-card">
          <div className="perfil-section-header">
            <h3>Ajustes de Cuenta y Seguridad</h3>
            <p>Administra tu contraseña, privacidad y configuración de notificaciones.</p>
          </div>

          <div className="ajustes-grid">
            <div className="ajuste-card">
              <h4>Sesión Activa</h4>
              <p>Finalizar tu sesión en este dispositivo y volver a la pantalla de acceso.</p>
              <button
                onClick={manejarCerrarSesion}
                className="btn-logout"
                style={{ marginTop: '0.65rem' }}
              >
                Cerrar Sesión
              </button>
            </div>

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
