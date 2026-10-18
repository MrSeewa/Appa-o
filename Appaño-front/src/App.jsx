import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorAutenticacion } from './context/AuthContext';
import { BarraNavegacion } from './components/Navbar';
import RutaProtegida from './components/ProtectedRoute';
import { PaginaPrincipal } from './pages/Home';
import { DetalleEvento } from './pages/EventoDetalle';
import { CrearEvento } from './pages/CrearEvento';
import { Perfil } from './pages/Perfil';
import Login from './pages/Login';

export default function App() {
  return (
    <ProveedorAutenticacion>
      <BrowserRouter>
        <div className="app-layout">
          <BarraNavegacion />
          <main className="main-content">
            <Routes>
              {/* Ruta Pública */}
              <Route path="/login" element={<Login />} />

              {/* Rutas Privadas protegidas por el guardián */}
              <Route element={<RutaProtegida />}>
                <Route path="/" element={<PaginaPrincipal />} />
                <Route path="/eventos" element={<PaginaPrincipal />} />
                <Route path="/eventos/:id" element={<DetalleEvento />} />
                <Route path="/crear-evento" element={<CrearEvento />} />
                <Route path="/perfil" element={<Perfil />} />
              </Route>

              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>Yo Appaño • Plataforma comunitaria de eventos • Hecho en Chile</p>
          </footer>
        </div>
      </BrowserRouter>
    </ProveedorAutenticacion>
  );
}

