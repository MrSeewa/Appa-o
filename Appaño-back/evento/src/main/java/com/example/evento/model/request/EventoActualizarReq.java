package com.example.evento.model.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EventoActualizarReq {

    public EventoActualizarReq() {
    }

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 150, message = "El título no puede superar los 150 caracteres")
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 2000, message = "La descripción no puede superar los 2000 caracteres")
    private String descripcion;

    @NotBlank(message = "La categoría es obligatoria")
    @Size(max = 50, message = "La categoría no puede superar los 50 caracteres")
    private String categoria;

    @NotNull(message = "La fecha del evento es obligatoria")
    private LocalDateTime fechaEvento;

    @NotNull(message = "El ID del usuario solicitante es obligatorio")
    private Long usuarioId;
}

