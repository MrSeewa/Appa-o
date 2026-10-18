import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicioEvento } from '../services/eventoService';
import { TarjetaEvento } from '../components/EventoCard';

export const PaginaPrincipal = () => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');

  const cargarEventos = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await servicioEvento.obtenerTodos();
      setEventos(datos);
    } catch (errorPeticion) {
      console.error('Error cargando eventos:', errorPeticion);
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

  // Filtrar solo los eventos vigentes (cuya fecha sea posterior o igual a la actual)
  const ahora = new Date();
  const eventosVigentes = eventos.filter((ev) => {
    if (!ev.fechaEvento) return true;
    return new Date(ev.fechaEvento).getTime() >= ahora.getTime();
  });

  // Ordenar cronológicamente los eventos vigentes (los más cercanos primero)
  const eventosOrdenados = [...eventosVigentes].sort((a, b) => {
    const tiempoA = a.fechaEvento ? new Date(a.fechaEvento).getTime() : 0;
    const tiempoB = b.fechaEvento ? new Date(b.fechaEvento).getTime() : 0;
    return tiempoA - tiempoB;
  });

  const categoriasDisponibles = [
    'TODAS',
    ...Array.from(new Set(eventosVigentes.map((ev) => ev.categoria).filter(Boolean))),
  ];

  const eventosFiltrados =
    categoriaFiltro === 'TODAS'
      ? eventosOrdenados
      : eventosOrdenados.filter((ev) => ev.categoria === categoriaFiltro);

  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Conecta, Organiza y Apaña en tu Comunidad</h1>
        <p>
          Explora actividades, deportes, música, videojuegos y talleres.
          Únete a eventos en tiempo real o publica el tuyo en segundos.
        </p>
        <div className="hero-actions">
          <Link to="/crear-evento" className="btn-primary">
            + Publicar un Evento
          </Link>
        </div>
      </header>

      <section className="eventos-section">
        <div className="section-header">
          <h2>Próximos Eventos Disponibles</h2>
          <div className="filtro-categorias">
            {categoriasDisponibles.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaFiltro(categoria)}
                className={`btn-filtro ${categoriaFiltro === categoria ? 'active' : ''}`}
              >
                {categoria}
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
              <TarjetaEvento key={evento.id} evento={evento} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Alias de compatibilidad
export const Home = PaginaPrincipal;
