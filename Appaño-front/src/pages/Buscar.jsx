import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { servicioEvento } from '../services/eventoService';
import { servicioUsuario } from '../services/usuarioService';
import { TarjetaEvento } from '../components/EventoCard';

export const PaginaBuscar = () => {
  const [parametrosBusqueda, setParametrosBusqueda] = useSearchParams();
  const consultaInicial = parametrosBusqueda.get('q') || '';

  const [termino, setTermino] = useState(consultaInicial);
  const [tipoFiltro, setTipoFiltro] = useState('todos'); // 'todos' | 'eventos' | 'usuarios'

  const [eventos, setEventos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Sincronizar estado local si cambia el parámetro de URL 'q'
  useEffect(() => {
    const parametroQ = parametrosBusqueda.get('q');
    if (parametroQ !== null && parametroQ !== termino) {
      setTermino(parametroQ);
    }
  }, [parametrosBusqueda]);

  // Cargar eventos y usuarios desde los microservicios
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError(null);
      try {
        const [datosEventos, datosUsuarios] = await Promise.all([
          servicioEvento.obtenerTodos().catch((err) => {
            console.error('Error cargando eventos:', err);
            return [];
          }),
          servicioUsuario.obtenerTodos().catch((err) => {
            console.error('Error cargando usuarios:', err);
            return [];
          }),
        ]);

        setEventos(datosEventos || []);
        setUsuarios(datosUsuarios || []);
      } catch (errorCarga) {
        console.error('Error al obtener datos para búsqueda:', errorCarga);
        setError('Ocurrió un problema al conectar con los servicios.');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const manejarCambioTermino = (evento) => {
    const nuevoValor = evento.target.value;
    setTermino(nuevoValor);

    // Actualizar la URL de búsqueda
    if (nuevoValor.trim()) {
      setParametrosBusqueda({ q: nuevoValor });
    } else {
      setParametrosBusqueda({});
    }
  };

  const limpiarBusqueda = () => {
    setTermino('');
    setParametrosBusqueda({});
  };

  const textoLimpio = termino.trim().toLowerCase();

  // Filtrado de eventos por nombre / título
  const eventosFiltrados = eventos.filter((ev) => {
    if (!textoLimpio) return true;
    const titulo = ev.titulo ? ev.titulo.toLowerCase() : '';
    const categoria = ev.categoria ? ev.categoria.toLowerCase() : '';
    return titulo.includes(textoLimpio) || categoria.includes(textoLimpio);
  });

  // Filtrado de usuarios por nombre o apodo
  const usuariosFiltrados = usuarios.filter((usr) => {
    if (!textoLimpio) return true;
    const nombre = usr.nombre ? usr.nombre.toLowerCase() : '';
    const apodo = usr.apodo ? usr.apodo.toLowerCase() : '';
    return nombre.includes(textoLimpio) || apodo.includes(textoLimpio);
  });

  const totalResultados = eventosFiltrados.length + usuariosFiltrados.length;

  return (
    <div className="buscar-page">
      <header className="hero-section" style={{ padding: '2rem 1rem 1.5rem 1rem' }}>
        <h1>Buscador de Eventos y Usuarios</h1>
        <p>
          Encuentra eventos por título o categoría, y conecta con otros miembros de la comunidad por su nombre o apodo.
        </p>

        <div className="buscador-principal-box">
          <input
            type="text"
            className="input-buscador-hero"
            placeholder="Escribe el nombre de un evento o usuario..."
            value={termino}
            onChange={manejarCambioTermino}
            autoFocus
          />
          {termino && (
            <button
              type="button"
              className="btn-limpiar-busqueda"
              onClick={limpiarBusqueda}
              title="Borrar término de búsqueda"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      <section className="eventos-section" style={{ marginTop: '1rem' }}>
        <div className="section-header">
          <div className="filtro-categorias">
            <button
              className={`btn-filtro ${tipoFiltro === 'todos' ? 'active' : ''}`}
              onClick={() => setTipoFiltro('todos')}
            >
              Todos ({totalResultados})
            </button>
            <button
              className={`btn-filtro ${tipoFiltro === 'eventos' ? 'active' : ''}`}
              onClick={() => setTipoFiltro('eventos')}
            >
              Eventos ({eventosFiltrados.length})
            </button>
            <button
              className={`btn-filtro ${tipoFiltro === 'usuarios' ? 'active' : ''}`}
              onClick={() => setTipoFiltro('usuarios')}
            >
              Usuarios ({usuariosFiltrados.length})
            </button>
          </div>
        </div>

        {cargando && (
          <div className="state-box">
            <div className="spinner"></div>
            <p>Buscando en los microservicios de Yo Appaño...</p>
          </div>
        )}

        {error && (
          <div className="state-box error-box">
            <p>{error}</p>
          </div>
        )}

        {!cargando && !error && totalResultados === 0 && (
          <div className="state-box empty-box">
            <p>No se encontraron eventos ni usuarios que coincidan con "{termino}".</p>
            <button onClick={limpiarBusqueda} className="btn-primary" style={{ marginTop: '1rem' }}>
              Ver todos los registros
            </button>
          </div>
        )}

        {/* Sección de Usuarios */}
        {!cargando &&
          !error &&
          (tipoFiltro === 'todos' || tipoFiltro === 'usuarios') &&
          usuariosFiltrados.length > 0 && (
            <div className="bloque-resultados-seccion" style={{ marginBottom: '2.5rem' }}>
              <div className="subseccion-titulo-barra">
                <h3>Usuarios Encontrados ({usuariosFiltrados.length})</h3>
              </div>
              <div className="usuarios-grid">
                {usuariosFiltrados.map((usr) => {
                  const idUsuario = usr.id || usr.id_usuario;
                  const inicial = usr.apodo ? usr.apodo.charAt(0).toUpperCase() : 'U';

                  return (
                    <div key={idUsuario} className="usuario-resultado-card">
                      <div className="usuario-card-avatar-box">
                        {usr.fotoPerfil ? (
                          <img
                            src={usr.fotoPerfil}
                            alt={usr.apodo}
                            className="usuario-resultado-avatar"
                          />
                        ) : (
                          <div className="usuario-resultado-placeholder">
                            {inicial}
                          </div>
                        )}
                      </div>

                      <div className="usuario-card-cuerpo">
                        <div className="usuario-card-nombre-fila">
                          <h4 className="usuario-card-nombre">{usr.nombre}</h4>
                          <span className="rol-badge">{usr.rol || 'USER'}</span>
                        </div>
                        <p className="usuario-card-apodo">@{usr.apodo}</p>
                        <p className="usuario-card-bio">
                          {usr.biografia
                            ? usr.biografia.length > 85
                              ? `${usr.biografia.substring(0, 85)}...`
                              : usr.biografia
                            : 'Sin biografía disponible.'}
                        </p>
                      </div>

                      <div className="usuario-card-pie">
                        <Link
                          to={`/perfil/${idUsuario}`}
                          className="btn-ver-usuario"
                        >
                          Ver Perfil →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Sección de Eventos */}
        {!cargando &&
          !error &&
          (tipoFiltro === 'todos' || tipoFiltro === 'eventos') &&
          eventosFiltrados.length > 0 && (
            <div className="bloque-resultados-seccion">
              <div className="subseccion-titulo-barra">
                <h3>Eventos Encontrados ({eventosFiltrados.length})</h3>
              </div>
              <div className="eventos-grid">
                {eventosFiltrados.map((ev) => (
                  <TarjetaEvento key={ev.id} evento={ev} />
                ))}
              </div>
            </div>
          )}
      </section>
    </div>
  );
};

export default PaginaBuscar;

