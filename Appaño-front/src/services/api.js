import axios from 'axios';

export const URL_BASE_USUARIOS = 'http://localhost:8080/api/usuarios';
export const URL_BASE_EVENTOS = 'http://localhost:8081/api/eventos';

export const apiUsuario = axios.create({
  baseURL: URL_BASE_USUARIOS,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiEvento = axios.create({
  baseURL: URL_BASE_EVENTOS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Alias compatibles para mantener coherencia
export const usuarioApi = apiUsuario;
export const eventoApi = apiEvento;
export const USUARIOS_BASE_URL = URL_BASE_USUARIOS;
export const EVENTOS_BASE_URL = URL_BASE_EVENTOS;
