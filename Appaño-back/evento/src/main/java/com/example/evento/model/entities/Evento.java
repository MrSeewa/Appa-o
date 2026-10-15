package com.example.evento.model.entities;

import java.time.LocalDateTime;

import com.example.evento.model.enums.EstadoEvento;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "eventos")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 2000)
    private String descripcion; // limite provisorio juas juas

    @Column(nullable = false, length = 50)
    private String categoria; 

    @Column(name = "fecha_evento", nullable = false)
    private LocalDateTime fechaEvento;

    // EL ENLACE ENTRE MICROSERVICIOS:
    // Se me le guarda estrictamente el número de ID, sin relaciones ManyToOne
    @Column(name = "creador_id", nullable = false)
    private Long creadorId;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }
}
