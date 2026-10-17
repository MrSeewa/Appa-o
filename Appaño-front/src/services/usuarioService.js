import { apiUsuario } from './api';

export const servicioUsuario = {
  // Obtener todos los usuarios
  obtenerTodos: async () => {
    const respuesta = await apiUsuario.get('');
    return respuesta.data;
  },

  // Obtener un usuario por su ID
  obtenerPorId: async (id) => {
    const respuesta = await apiUsuario.get(`/${id}`);
    return respuesta.data;
  },

  // Registrar un nuevo usuario
  crear: async (datosUsuario) => {
    const respuesta = await apiUsuario.post('', datosUsuario);
    return respuesta.data;
  },

  // Actualizar datos de un usuario
  actualizar: async (id, datosActualizar) => {
    const respuesta = await apiUsuario.put(`/${id}`, datosActualizar);
    return respuesta.data;
  },

  // Eliminar un usuario
  eliminar: async (id) => {
    const respuesta = await apiUsuario.delete(`/${id}`);
    return respuesta.data;
  },

  // Subir foto de perfil como archivo físico (Multipart FormData)
  subirFotoPerfil: async (id, archivo) => {
    const formularioDatos = new FormData();
    formularioDatos.append('file', archivo);

    const respuesta = await apiUsuario.post(`/${id}/subir-foto`, formularioDatos, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return respuesta.data;
  },
};

// Alias compatible
export const usuarioService = servicioUsuario;
