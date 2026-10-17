import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { servicioEvento } from '../services/eventoService';
import { useAutenticacion } from '../context/AuthContext';

export const CrearEvento = () => {
  const { usuarioActual } = useAutenticacion();
  const navegar = useNavigate();

  const [formulario, setFormulario] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Deportes',
    fechaEvento: '',
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  const categoriasDisponibles = [
    'Deportes',
    'Videojuegos',
    'Música',
    'Estudio / Talleres',
    'Juntas y Salidas',
    'Voluntariado',
    'Otro',
  ];

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((estadoPrevio) => ({
      ...estadoPrevio,
      [name]: value,
    }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (!usuarioActual) {
      setError('Debes tener un usuario activo para publicar un evento.');
      return;
    }

    setGuardando(true);
    setError(null);

    const datosParaGuardar = {
      ...formulario,
      creadorId: usuarioActual.id || usuarioActual.id_usuario,
    };

    try {
      const nuevoEvento = await servicioEvento.crear(datosParaGuardar);
      navegar(`/eventos/${nuevoEvento.id}`);
    } catch (errorPeticion) {
      console.error('Error al crear el evento:', errorPeticion);
      const mensajeError =
        errorPeticion.response?.data?.mensaje ||
        errorPeticion.response?.data?.detalle ||
        'Error al comunicarse con el microservicio de Eventos.';
      setError(mensajeError);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <Link to="/" className="btn-back">
            ← Cancelar
          </Link>
          <h2>Publicar Nuevo Evento</h2>
          <p>
            Publicando como: <strong>{usuarioActual?.nombre}</strong> (@{usuarioActual?.apodo})
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
              placeholder="Ej: Pichanga en San Joaquín, Tarde de Smash, etc."
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
              placeholder="Explica de qué trata el evento, qué hay que llevar, el lugar exacto, o las reglas básicas..."
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
              {guardando ? 'Guardando en el microservicio...' : 'Publicar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
