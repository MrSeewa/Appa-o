import { usuarioApi } from './api';

export const usuarioService = {
  // Obtener todos los usuarios
  obtenerTodos: async () => {
    const response = await usuarioApi.get('');
    return response.data;
  },

  // Obtener un usuario por su ID
  obtenerPorId: async (id) => {
    const response = await usuarioApi.get(`/${id}`);
    return response.data;
  },

  // Registrar un nuevo usuario
  crear: async (datosUsuario) => {
    const response = await usuarioApi.post('', datosUsuario);
    return response.data;
  },

  // Actualizar datos de un usuario
  actualizar: async (id, datosActualizar) => {
    const response = await usuarioApi.put(`/${id}`, datosActualizar);
    return response.data;
  },

  // Eliminar un usuario
  eliminar: async (id) => {
    const response = await usuarioApi.delete(`/${id}`);
    return response.data;
  },
};

