package com.example.evento.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.evento.model.entities.Evento;
import com.example.evento.model.entities.Inscripcion;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {

    // 1. Cuenta cuántas inscripciones tiene un evento (contador para el frontend)
    long countByEventoId(Long eventoId);

    // 2. Verifica si un usuario ya está inscrito para no anotarlo dos veces
    boolean existsByEventoAndUsuarioId(Evento evento, Long usuarioId);

    // 3. Obtiene las inscripciones de un usuario cargando el evento relacionado
    @Query("SELECT i FROM Inscripcion i JOIN FETCH i.evento WHERE i.usuarioId = :usuarioId ORDER BY i.fechaInscripcion DESC")
    List<Inscripcion> findByUsuarioIdConEvento(@Param("usuarioId") Long usuarioId);
}
