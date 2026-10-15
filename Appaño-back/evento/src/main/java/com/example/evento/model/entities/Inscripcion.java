package com.example.evento.model.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "inscripciones")
@Data
public class Inscripcion {

    public Inscripcion() {
    }

    public Inscripcion(Evento evento, Long usuarioId) {
        this.evento = evento;
        this.usuarioId = usuarioId;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con el evento en la misma base de datos
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    // ID del usuario que viene del microservicio de Usuarios
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "fecha_inscripcion", updatable = false)
    private LocalDateTime fechaInscripcion;

    @PrePersist
    protected void onCreate() {
        this.fechaInscripcion = LocalDateTime.now();
    }

    public static class InscripcionBuilder {
        private Evento evento;
        private Long usuarioId;

        public InscripcionBuilder evento(Evento evento) {
            this.evento = evento;
            return this;
        }

        public InscripcionBuilder usuarioId(Long usuarioId) {
            this.usuarioId = usuarioId;
            return this;
        }

        public Inscripcion build() {
            Inscripcion inscripcion = new Inscripcion();
            inscripcion.setEvento(this.evento);
            inscripcion.setUsuarioId(this.usuarioId);
            return inscripcion;
        }
    }

    public static InscripcionBuilder builder() {
        return new InscripcionBuilder();
    }
}
