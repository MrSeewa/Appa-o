import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../context/AuthContext';
// import axios from 'axios'; // Descomentar cuando conectes la API de autenticación con JWT

export default function Login() {
  // 1. Manejo del estado del formulario agrupado en un solo objeto
  const [credenciales, setCredenciales] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const navegar = useNavigate();
  const { iniciarSesion, usuariosDisponibles } = useAutenticacion();

  // 2. Función para actualizar el estado cuando el usuario escribe
  const manejarCambio = (evento) => {
    setCredenciales({
      ...credenciales,
      [evento.target.name]: evento.target.value,
    });
  };

  // 3. Función que se ejecuta al enviar el formulario
  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setError(null);
    setCargando(true);

    try {
      // TODO: Aquí irá la llamada a tu futuro endpoint de Spring Boot con Spring Security
      // const respuesta = await axios.post('http://localhost:8080/api/auth/login', credenciales);
      console.log('Simulando envío de credenciales:', credenciales);

      // Conectado con el contexto de autenticación local:
      await iniciarSesion(credenciales.email, credenciales.password);

      // Redirigimos al usuario al catálogo de eventos
      navegar('/eventos');
    } catch (errorPeticion) {
      setError(errorPeticion.message || 'Credenciales incorrectas. Intenta nuevamente.');
      console.error(errorPeticion);
    } finally {
      setCargando(false);
    }
  };

  // Helper para autocompletar con una cuenta de prueba
  const seleccionarCuentaPrueba = (correo) => {
    setCredenciales({
      email: correo,
      password: 'password123',
    });
  };

  // 4. Renderizado del formulario
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa a tu cuenta para inscribirte y gestionar tus eventos en Appaño.</p>
        </div>

        {error && <div className="alert-box error">{error}</div>}

        <form onSubmit={manejarEnvio} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credenciales.email}
              onChange={manejarCambio}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credenciales.password}
              onChange={manejarCambio}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={cargando} className="btn-primary btn-submit">
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Sección de Cuentas de Prueba existentes en tu base de datos */}
        {usuariosDisponibles.length > 0 && (
          <div className="demo-accounts-box">
            <span className="demo-title">Cuentas de prueba en tu base de datos:</span>
            <div className="demo-chips">
              {usuariosDisponibles.map((usuario) => {
                const idUsuario = usuario.id || usuario.id_usuario;
                return (
                  <button
                    key={idUsuario}
                    type="button"
                    className="demo-chip"
                    onClick={() => seleccionarCuentaPrueba(usuario.correo)}
                  >
                    @{usuario.apodo} ({usuario.correo})
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
