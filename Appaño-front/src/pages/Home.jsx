import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventoService } from '../services/eventoService';
import { EventoCard } from '../components/EventoCard';

export const Home = () => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');

  const cargarEventos = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await eventoService.obtenerTodos();
      setEventos(data);
    } catch (err) {
      console.error('Error cargando eventos:', err);
      setError(
        'No se pudo conectar con el microservicio de Eventos (puerto 8081). Verifica que esté encendido.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const categorias = [
    'TODAS',
    ...Array.from(new Set(eventos.map((e) => e.categoria).filter(Boolean))),
  ];

  const eventosFiltrados =
    categoriaFiltro === 'TODAS'
      ? eventos
      : eventos.filter((e) => e.categoria === categoriaFiltro);

  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Encuentra y organízate con tu comunidad</h1>
        <p>
          Descubre actividades, pichangas, talleres y juntas. Inscríbete o publica
          tu propio evento en segundos.
        </p>
        <div className="hero-actions">
          <Link to="/crear-evento" className="btn-primary">
            + Crear un Nuevo Evento
          </Link>
        </div>
      </header>

      <section className="eventos-section">
        <div className="section-header">
          <h2>Próximos Eventos Disponibles</h2>
          <div className="filtro-categorias">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`btn-filtro ${categoriaFiltro === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {cargando && (
          <div className="state-box">
            <div className="spinner"></div>
            <p>Cargando eventos desde el microservicio...</p>
          </div>
        )}

        {error && (
          <div className="state-box error-box">
            <p>{error}</p>
            <button onClick={cargarEventos} className="btn-retry">
              Reintentar conexión
            </button>
          </div>
        )}

        {!cargando && !error && eventosFiltrados.length === 0 && (
          <div className="state-box empty-box">
            <p>No se encontraron eventos en esta categoría.</p>
            <Link to="/crear-evento" className="btn-primary">
              Sé el primero en publicar uno
            </Link>
          </div>
        )}

        {!cargando && !error && eventosFiltrados.length > 0 && (
          <div className="eventos-grid">
            {eventosFiltrados.map((evento) => (
              <EventoCard key={evento.id} evento={evento} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

