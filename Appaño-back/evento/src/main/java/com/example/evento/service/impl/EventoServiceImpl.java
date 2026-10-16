package com.example.evento.service.impl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.evento.client.UsuarioClient;
import com.example.evento.model.entities.Evento;
import com.example.evento.model.entities.Inscripcion;
import com.example.evento.model.request.EventoRegistroReq;
import com.example.evento.model.response.EventoDetalleRes;
import com.example.evento.model.response.UsuarioPublicoDTO;
import com.example.evento.repository.EventoRepository;
import com.example.evento.repository.InscripcionRepository;
import com.example.evento.service.EventoService;

@Service
public class EventoServiceImpl implements EventoService {

    private final EventoRepository eventoRepository;
    private final InscripcionRepository inscripcionRepository;
    private final UsuarioClient usuarioClient;

    public EventoServiceImpl(EventoRepository eventoRepository,
                             InscripcionRepository inscripcionRepository,
                             UsuarioClient usuarioClient) {
        this.eventoRepository = eventoRepository;
        this.inscripcionRepository = inscripcionRepository;
        this.usuarioClient = usuarioClient;
    }

    @Override
    public void inscribirUsuario(Long eventoId, Long usuarioId) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado"));

        if (inscripcionRepository.existsByEventoAndUsuarioId(evento, usuarioId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario ya está inscrito en este evento");
        }

        Inscripcion nuevaInscripcion = Inscripcion.builder()
                .evento(evento)
                .usuarioId(usuarioId)
                .build();

        inscripcionRepository.save(nuevaInscripcion);
    }

    @Override
    public EventoDetalleRes obtenerDetalleEvento(Long eventoId) {
        Evento evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado"));

        return construirDetalleEvento(evento);
    }

    @Override
    public EventoDetalleRes crearEvento(EventoRegistroReq request) {
        UsuarioPublicoDTO creador;
        try {
            creador = usuarioClient.obtenerPerfilCreador(request.getCreadorId());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se pudo verificar el creador: usuario no encontrado en el microservicio de usuarios");
        }

        if (creador == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El usuario creador no existe");
        }

        Evento evento = new Evento();
        evento.setTitulo(request.getTitulo());
        evento.setDescripcion(request.getDescripcion());
        evento.setCategoria(request.getCategoria());
        evento.setFechaEvento(request.getFechaEvento());
        evento.setCreadorId(request.getCreadorId());

        Evento guardado = eventoRepository.save(evento);

        return EventoDetalleRes.builder()
                .id(guardado.getId())
                .titulo(guardado.getTitulo())
                .descripcion(guardado.getDescripcion())
                .categoria(guardado.getCategoria())
                .fechaEvento(guardado.getFechaEvento())
                .creador(creador)
                .cantidadInscritos(0L)
                .build();
    }

    @Override
    public List<EventoDetalleRes> obtenerTodosLosEventos() {
        return eventoRepository.findAll().stream()
                .map(this::construirDetalleEvento)
                .toList();
    }

    private EventoDetalleRes construirDetalleEvento(Evento evento) {
        UsuarioPublicoDTO creador;
        try {
            creador = usuarioClient.obtenerPerfilCreador(evento.getCreadorId());
        } catch (Exception e) {
            creador = new UsuarioPublicoDTO();
            creador.setId(evento.getCreadorId());
            creador.setNombre("Usuario no disponible");
        }

        long cantidadInscritos = inscripcionRepository.countByEventoId(evento.getId());

        return EventoDetalleRes.builder()
                .id(evento.getId())
                .titulo(evento.getTitulo())
                .descripcion(evento.getDescripcion())
                .categoria(evento.getCategoria())
                .fechaEvento(evento.getFechaEvento())
                .creador(creador)
                .cantidadInscritos(cantidadInscritos)
                .build();
    }
}

