import axios from 'axios';

export const USUARIOS_BASE_URL = 'http://localhost:8080/api/usuarios';
export const EVENTOS_BASE_URL = 'http://localhost:8081/api/eventos';

export const usuarioApi = axios.create({
  baseURL: USUARIOS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventoApi = axios.create({
  baseURL: EVENTOS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

