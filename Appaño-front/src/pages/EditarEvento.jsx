import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { servicioEvento } from '../services/eventoService';
import { useAutenticacion } from '../context/AuthContext';

export const EditarEvento = () => {
  const { id } = useParams();
  const { usuarioActual } = useAutenticacion();
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Deportes',
    fechaEvento: '',
  });

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [esCreador, setEsCreador] = useState(false);

  const categoriasDisponibles = [
    'Deportes',
    'Videojuegos',
    'Música',
    'Estudio / Talleres',
    'Juntas y Salidas',
    'Voluntariado',
    'Otro',
  ];

  useEffect(() => {
    const cargarEvento = async () => {
      setCargando(true);
      setError(null);

      try {
        const datos = await servicioEvento.obtenerPorId(id);
        const idUsuario = usuarioActual?.id || usuarioActual?.id_usuario;
        const creadorId = datos.creadorId || datos.creador?.id || datos.creador?.id_usuario;

        if (Number(creadorId) !== Number(idUsuario)) {
          setError('No tienes permisos para modificar este evento. Solo el creador original puede editarlo.');
          setEsCreador(false);
          return;
        }

        setEsCreador(true);
        setFormulario({
          titulo: datos.titulo || '',
          descripcion: datos.descripcion || '',
          categoria: datos.categoria || 'Deportes',
          fechaEvento: datos.fechaEvento ? datos.fechaEvento.substring(0, 16) : '',
        });
      } catch (errorPeticion) {
        console.error('Error al cargar evento para edición:', errorPeticion);
        setError('No se pudo cargar la información del evento.');
      } finally {
        setCargando(false);
      }
    };

    cargarEvento();
  }, [id, usuarioActual]);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((estadoPrevio) => ({
      ...estadoPrevio,
      [name]: value,
    }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (!usuarioActual || !esCreador) return;

    setGuardando(true);
    setError(null);

    const idUsuario = usuarioActual.id || usuarioActual.id_usuario;

    try {
      await servicioEvento.actualizar(id, {
        ...formulario,
        usuarioId: idUsuario,
      });

      // Redirigir al detalle del evento actualizado
      navegar(`/eventos/${id}`);
    } catch (errorPeticion) {
      console.error('Error al actualizar el evento:', errorPeticion);
      const mensajeError =
        errorPeticion.response?.data?.mensaje ||
        errorPeticion.response?.data?.detalle ||
        'Error al guardar los cambios en el evento.';
      setError(mensajeError);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="state-box" style={{ maxWidth: '550px', margin: '4rem auto' }}>
        <div className="spinner"></div>
        <p>Cargando información del evento...</p>
      </div>
    );
  }

  if (error && !esCreador) {
    return (
      <div className="state-box error-box" style={{ maxWidth: '550px', margin: '4rem auto' }}>
        <h3>Acceso restringido</h3>
        <p>{error}</p>
        <Link to={`/eventos/${id}`} className="btn-primary" style={{ marginTop: '1rem' }}>
          Volver al detalle del evento
        </Link>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <Link to={`/eventos/${id}`} className="btn-back">
            ← Cancelar y volver
          </Link>
          <h2>Modificar Evento</h2>
          <p>
            Editando como organizador: <strong>{usuarioActual?.nombre}</strong> (@{usuarioActual?.apodo})
          </p>
        </div>

        {error && <div className="alert-box error">{error}</div>}

        <form onSubmit={manejarEnvio} className="crear-evento-form">
          <div className="form-group">
            <label htmlFor="titulo">Título del Evento *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              required
              maxLength={150}
              value={formulario.titulo}
              onChange={manejarCambio}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={formulario.categoria}
                onChange={manejarCambio}
              >
                {categoriasDisponibles.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fechaEvento">Fecha y Hora *</label>
              <input
                type="datetime-local"
                id="fechaEvento"
                name="fechaEvento"
                required
                value={formulario.fechaEvento}
                onChange={manejarCambio}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción detallada *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={5}
              required
              value={formulario.descripcion}
              onChange={manejarCambio}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={guardando}
              className="btn-primary btn-submit"
            >
              {guardando ? 'Guardando modificaciones...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarEvento;

