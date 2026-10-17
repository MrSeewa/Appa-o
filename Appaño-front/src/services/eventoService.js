import { eventoApi } from './api';

export const eventoService = {
  // Obtener todos los eventos con sus creadores e inscritos
  obtenerTodos: async () => {
    const response = await eventoApi.get('');
    return response.data;
  },

  // Obtener el detalle completo de un evento por ID
  obtenerPorId: async (id) => {
    const response = await eventoApi.get(`/${id}`);
    return response.data;
  },

  // Publicar un nuevo evento
  crear: async (eventoData) => {
    const response = await eventoApi.post('', eventoData);
    return response.data;
  },

  // Inscribir a un usuario en el evento
  inscribirUsuario: async (eventoId, usuarioId) => {
    const response = await eventoApi.post(`/${eventoId}/inscribir?usuarioId=${usuarioId}`);
    return response.data;
  },
};

