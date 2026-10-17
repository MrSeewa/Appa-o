import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eventoService } from '../services/eventoService';
import { useAuth } from '../context/AuthContext';

export const CrearEvento = () => {
  const { usuarioActual } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioActual) {
      setError('Debes tener un usuario activo para publicar un evento.');
      return;
    }

    setGuardando(true);
    setError(null);

    const payload = {
      ...formData,
      creadorId: usuarioActual.id || usuarioActual.id_usuario,
    };

    try {
      const nuevoEvento = await eventoService.crear(payload);
      navigate(`/eventos/${nuevoEvento.id}`);
    } catch (err) {
      console.error('Error al crear el evento:', err);
      const msg =
        err.response?.data?.mensaje ||
        err.response?.data?.detalle ||
        'Error al comunicarse con el microservicio de Eventos.';
      setError(msg);
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

        <form onSubmit={handleSubmit} className="crear-evento-form">
          <div className="form-group">
            <label htmlFor="titulo">Título del Evento *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              required
              maxLength={150}
              placeholder="Ej: Pichanga en San Joaquín, Tarde de Smash, etc."
              value={formData.titulo}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                {categoriasDisponibles.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
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
                value={formData.fechaEvento}
                onChange={handleChange}
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
              value={formData.descripcion}
              onChange={handleChange}
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

