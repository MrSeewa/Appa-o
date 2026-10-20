package com.example.evento.service;

import java.util.List;

import com.example.evento.model.request.EventoActualizarReq;
import com.example.evento.model.request.EventoRegistroReq;
import com.example.evento.model.response.EventoDetalleRes;

public interface EventoService {

    EventoDetalleRes crearEvento(EventoRegistroReq request);

    EventoDetalleRes actualizarEvento(Long eventoId, EventoActualizarReq request);

    List<EventoDetalleRes> obtenerTodosLosEventos();

    EventoDetalleRes obtenerDetalleEvento(Long eventoId);

    void inscribirUsuario(Long eventoId, Long usuarioId);

    List<EventoDetalleRes> obtenerEventosInscritosPorUsuario(Long usuarioId);
}
