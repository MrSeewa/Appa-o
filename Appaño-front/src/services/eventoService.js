import { apiEvento } from './api';

export const servicioEvento = {
  // Obtener todos los eventos con sus creadores e inscritos
  obtenerTodos: async () => {
    const respuesta = await apiEvento.get('');
    return respuesta.data;
  },

  // Obtener el detalle completo de un evento por ID
  obtenerPorId: async (id) => {
    const respuesta = await apiEvento.get(`/${id}`);
    return respuesta.data;
  },

  // Publicar un nuevo evento
  crear: async (datosEvento) => {
    const respuesta = await apiEvento.post('', datosEvento);
    return respuesta.data;
  },

  // Modificar un evento existente (solo el creador)
  actualizar: async (idEvento, datosActualizar) => {
    const respuesta = await apiEvento.put(`/${idEvento}`, datosActualizar);
    return respuesta.data;
  },

  // Inscribir a un usuario en el evento
  inscribirUsuario: async (idEvento, idUsuario) => {
    const respuesta = await apiEvento.post(`/${idEvento}/inscribir?usuarioId=${idUsuario}`);
    return respuesta.data;
  },

  // Obtener los eventos a los que se ha inscrito un usuario
  obtenerInscripcionesUsuario: async (idUsuario) => {
    const respuesta = await apiEvento.get(`/inscripciones/usuario/${idUsuario}`);
    return respuesta.data;
  },
};

// Alias compatible
export const eventoService = servicioEvento;
