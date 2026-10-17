import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { EventoDetalle } from './pages/EventoDetalle';
import { CrearEvento } from './pages/CrearEvento';
import Login from './pages/Login';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Ruta Pública */}
              <Route path="/login" element={<Login />} />

              {/* Rutas Privadas protegidas por el guardián */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/eventos" element={<Home />} />
                <Route path="/eventos/:id" element={<EventoDetalle />} />
                <Route path="/crear-evento" element={<CrearEvento />} />
              </Route>

              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>Appaño © 2026 - Plataforma de eventos y comunidad (Microservicios Spring Boot + React)</p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
