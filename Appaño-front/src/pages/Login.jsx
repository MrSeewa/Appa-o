import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../context/AuthContext';

export default function Login() {
  // Modo actual: 'ingreso' (Login) o 'registro' (Crear cuenta)
  const [modo, setModo] = useState('ingreso');

  // Estado del formulario de inicio de sesión
  const [credenciales, setCredenciales] = useState({
    email: '',
    password: '',
  });

  // Estado del formulario de registro de nuevo usuario
  const [formularioRegistro, setFormularioRegistro] = useState({
    nombre: '',
    apodo: '',
    correo: '',
    password: '',
    confirmarPassword: '',
    biografia: '',
  });

  const [mensajeError, setMensajeError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [cargando, setCargando] = useState(false);

  const navegar = useNavigate();
  const { iniciarSesion, registrarUsuario, usuariosDisponibles } = useAutenticacion();

  // Cambiar entre pestañas de inicio de sesión y registro
  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    setMensajeError(null);
    setMensajeExito(null);
  };

  // Manejar inputs del formulario de login
  const manejarCambioIngreso = (evento) => {
    setCredenciales({
      ...credenciales,
      [evento.target.name]: evento.target.value,
    });
  };

  // Manejar inputs del formulario de registro
  const manejarCambioRegistro = (evento) => {
    setFormularioRegistro({
      ...formularioRegistro,
      [evento.target.name]: evento.target.value,
    });
  };

  // Enviar formulario de inicio de sesión
  const manejarEnvioIngreso = async (evento) => {
    evento.preventDefault();
    setMensajeError(null);
    setCargando(true);

    try {
      await iniciarSesion(credenciales.email, credenciales.password);
      navegar('/eventos');
    } catch (errorPeticion) {
      setMensajeError(errorPeticion.message || 'Credenciales incorrectas. Intenta nuevamente.');
      console.error(errorPeticion);
    } finally {
      setCargando(false);
    }
  };

  // Enviar formulario de registro
  const manejarEnvioRegistro = async (evento) => {
    evento.preventDefault();
    setMensajeError(null);
    setMensajeExito(null);

    // Validaciones en el cliente
    if (formularioRegistro.password.length < 6) {
      setMensajeError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formularioRegistro.password !== formularioRegistro.confirmarPassword) {
      setMensajeError('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    const regexApodo = /^[a-zA-Z0-9_]{3,20}$/;
    if (!regexApodo.test(formularioRegistro.apodo)) {
      setMensajeError('El apodo debe tener entre 3 y 20 caracteres (solo letras, números o guiones bajos).');
      return;
    }

    setCargando(true);

    try {
      const nuevoUsuarioReq = {
        nombre: formularioRegistro.nombre.trim(),
        apodo: formularioRegistro.apodo.trim(),
        correo: formularioRegistro.correo.trim(),
        password: formularioRegistro.password,
        biografia: formularioRegistro.biografia.trim(),
        rol: 'USER',
      };

      await registrarUsuario(nuevoUsuarioReq);
      setMensajeExito('Tu cuenta ha sido creada exitosamente. Redirigiendo a eventos...');
      setTimeout(() => {
        navegar('/eventos');
      }, 1000);
    } catch (errorPeticion) {
      console.error('Error al registrar usuario:', errorPeticion);
      let mensaje = 'Ocurrió un error al registrar el usuario. Intenta nuevamente.';
      const datosError = errorPeticion.response?.data;
      if (datosError?.errores && typeof datosError.errores === 'object') {
        mensaje = Object.values(datosError.errores).join('. ');
      } else if (datosError?.mensaje) {
        mensaje = datosError.mensaje;
      } else if (datosError?.detalle) {
        mensaje = datosError.detalle;
      }
      setMensajeError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  // Autocompletar con cuenta existente para pruebas rápidas
  const seleccionarCuentaPrueba = (correo) => {
    setCredenciales({
      email: correo,
      password: 'password123',
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Selector de Pestañas: Iniciar Sesión / Registrarse */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${modo === 'ingreso' ? 'active' : ''}`}
            onClick={() => cambiarModo('ingreso')}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${modo === 'registro' ? 'active' : ''}`}
            onClick={() => cambiarModo('registro')}
          >
            Crear Cuenta
          </button>
        </div>

        <div className="login-header">
          <h2>{modo === 'ingreso' ? 'Iniciar Sesión' : 'Crear Nueva Cuenta'}</h2>
          <p>
            {modo === 'ingreso'
              ? 'Ingresa a tu cuenta para inscribirte y gestionar tus eventos en Appaño.'
              : 'Únete a la comunidad de Appaño para descubrir y organizar eventos.'}
          </p>
        </div>

        {mensajeError && <div className="alert-box error">{mensajeError}</div>}
        {mensajeExito && <div className="alert-box success">{mensajeExito}</div>}

        {/* Formulario de Inicio de Sesión */}
        {modo === 'ingreso' && (
          <form onSubmit={manejarEnvioIngreso} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={credenciales.email}
                onChange={manejarCambioIngreso}
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
                onChange={manejarCambioIngreso}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={cargando} className="btn-primary btn-submit">
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        )}

        {/* Formulario de Registro de Usuario */}
        {modo === 'registro' && (
          <form onSubmit={manejarEnvioRegistro} className="login-form">
            <div className="form-group">
              <label htmlFor="registro-nombre">Nombre Completo *</label>
              <input
                type="text"
                id="registro-nombre"
                name="nombre"
                value={formularioRegistro.nombre}
                onChange={manejarCambioRegistro}
                placeholder="Ej. Juan Pérez"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registro-apodo">Apodo / Nombre de Usuario *</label>
              <input
                type="text"
                id="registro-apodo"
                name="apodo"
                value={formularioRegistro.apodo}
                onChange={manejarCambioRegistro}
                placeholder="Ej. juan_p (sin espacios, 3-20 caracteres)"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="registro-correo">Correo Electrónico *</label>
              <input
                type="email"
                id="registro-correo"
                name="correo"
                value={formularioRegistro.correo}
                onChange={manejarCambioRegistro}
                placeholder="juan@correo.com"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="registro-password">Contraseña *</label>
                <input
                  type="password"
                  id="registro-password"
                  name="password"
                  value={formularioRegistro.password}
                  onChange={manejarCambioRegistro}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="registro-confirmar">Confirmar Contraseña *</label>
                <input
                  type="password"
                  id="registro-confirmar"
                  name="confirmarPassword"
                  value={formularioRegistro.confirmarPassword}
                  onChange={manejarCambioRegistro}
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="registro-biografia">Presentación o Biografía (Opcional)</label>
              <textarea
                id="registro-biografia"
                name="biografia"
                rows={2}
                maxLength={500}
                value={formularioRegistro.biografia}
                onChange={manejarCambioRegistro}
                placeholder="Breve descripción de tus intereses en actividades..."
              />
            </div>

            <button type="submit" disabled={cargando} className="btn-primary btn-submit">
              {cargando ? 'Creando cuenta...' : 'Crear mi Cuenta'}
            </button>
          </form>
        )}

        {/* Enlace para alternar entre Login y Registro */}
        <div className="auth-cambio-modo">
          {modo === 'ingreso' ? (
            <p>
              ¿No tienes una cuenta aún?{' '}
              <button
                type="button"
                className="btn-enlace-texto"
                onClick={() => cambiarModo('registro')}
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes una cuenta registrada?{' '}
              <button
                type="button"
                className="btn-enlace-texto"
                onClick={() => cambiarModo('ingreso')}
              >
                Inicia sesión aquí
              </button>
            </p>
          )}
        </div>

        {/* Cuentas de prueba existentes (solo en modo ingreso) */}
        {modo === 'ingreso' && usuariosDisponibles.length > 0 && (
          <div className="demo-accounts-box">
            <span className="demo-title">Cuentas disponibles en tu base de datos:</span>
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
