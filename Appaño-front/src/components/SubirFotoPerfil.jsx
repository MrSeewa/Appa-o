import React, { useState } from 'react';
import { servicioUsuario } from '../services/usuarioService';

export const SubirFotoPerfil = ({ idUsuario, fotoActual, alSubirExitoso }) => {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [previsualizacion, setPrevisualizacion] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);

  // 1. Manejar la seleccion del archivo de imagen
  const manejarCambioArchivo = (evento) => {
    const archivo = evento.target.files && evento.target.files[0];
    if (archivo) {
      // Validar tipo de archivo
      if (!archivo.type.startsWith('image/')) {
        setEsError(true);
        setMensaje('El archivo seleccionado debe ser una imagen (JPG, PNG, WEBP, etc.).');
        return;
      }

      // Validar tamano maximo (ej. 10MB)
      if (archivo.size > 10 * 1024 * 1024) {
        setEsError(true);
        setMensaje('La imagen supera el límite máximo de 10 MB.');
        return;
      }

      setArchivoSeleccionado(archivo);
      setPrevisualizacion(URL.createObjectURL(archivo));
      setMensaje('');
      setEsError(false);
    }
  };

  // 2. Enviar el archivo mediante Multipart FormData al microservicio
  const manejarSubida = async (evento) => {
    evento.preventDefault();
    if (!archivoSeleccionado || !idUsuario) return;

    setSubiendo(true);
    setMensaje('');
    setEsError(false);

    try {
      const respuesta = await servicioUsuario.subirFotoPerfil(idUsuario, archivoSeleccionado);
      setMensaje('Foto de perfil actualizada con éxito en el servidor.');
      setEsError(false);
      setArchivoSeleccionado(null);

      // Notificar al componente padre con la nueva URL de la imagen
      if (alSubirExitoso) {
        alSubirExitoso(respuesta.fotoPerfil);
      }
    } catch (error) {
      console.error('Error al subir la imagen de perfil:', error);
      setEsError(true);
      const detalleError =
        error.response?.data?.mensaje ||
        error.response?.data ||
        'Ocurrió un error al subir la foto al servidor.';
      setMensaje(typeof detalleError === 'string' ? detalleError : 'Error al subir la foto.');
    } finally {
      setSubiendo(false);
    }
  };

  const cancelarSeleccion = () => {
    setArchivoSeleccionado(null);
    setPrevisualizacion(null);
    setMensaje('');
    setEsError(false);
  };

  const imagenAMostrar = previsualizacion || fotoActual;

  return (
    <div className="subir-foto-card">
      <div className="subir-foto-header">
        <h4>Foto de Perfil</h4>
        <p>Sube una foto desde tu computador para personalizar tu cuenta en Yo Appaño.</p>
      </div>

      <div className="subir-foto-cuerpo">
        <div className="avatar-preview-wrapper">
          {imagenAMostrar ? (
            <img
              src={imagenAMostrar}
              alt="Vista previa de perfil"
              className="avatar-circulo"
            />
          ) : (
            <div className="avatar-circulo-vacio">
              <span>Sin foto</span>
            </div>
          )}
        </div>

        <form onSubmit={manejarSubida} className="subir-foto-formulario">
          <input
            type="file"
            id="selector-foto-perfil"
            accept="image/*"
            onChange={manejarCambioArchivo}
            className="input-archivo-oculto"
          />

          <div className="subir-foto-botones">
            <label htmlFor="selector-foto-perfil" className="btn-seleccionar-archivo">
              {archivoSeleccionado ? 'Cambiar Imagen Elegida' : 'Elegir Imagen del Disco'}
            </label>

            {archivoSeleccionado && (
              <>
                <button
                  type="submit"
                  disabled={subiendo}
                  className="btn-primary"
                >
                  {subiendo ? 'Subiendo imagen...' : 'Guardar en el Servidor'}
                </button>
                <button
                  type="button"
                  disabled={subiendo}
                  onClick={cancelarSeleccion}
                  className="btn-cancelar-archivo"
                >
                  Descartar
                </button>
              </>
            )}
          </div>

          {archivoSeleccionado && (
            <span className="archivo-seleccionado-nombre">
              Archivo seleccionado: {archivoSeleccionado.name} ({(archivoSeleccionado.size / 1024).toFixed(1)} KB)
            </span>
          )}
        </form>
      </div>

      {mensaje && (
        <div className={`alert-box ${esError ? 'error' : 'success'}`} style={{ marginTop: '1rem' }}>
          {mensaje}
        </div>
      )}
    </div>
  );
};

// Alias de compatibilidad
export const EditarPerfil = SubirFotoPerfil;
export default SubirFotoPerfil;

