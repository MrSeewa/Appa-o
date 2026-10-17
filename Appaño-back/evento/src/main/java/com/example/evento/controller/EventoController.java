package com.example.evento.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.evento.model.request.EventoRegistroReq;
import com.example.evento.model.response.EventoDetalleRes;
import com.example.evento.service.EventoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @PostMapping
    public ResponseEntity<EventoDetalleRes> crearEvento(@Valid @RequestBody EventoRegistroReq request) {
        EventoDetalleRes nuevoEvento = eventoService.crearEvento(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEvento);
    }

    @GetMapping
    public ResponseEntity<List<EventoDetalleRes>> listarEventos() {
        return ResponseEntity.ok(eventoService.obtenerTodosLosEventos());
    }

    @GetMapping("/{id}")
    public EventoDetalleRes obtenerEvento(@PathVariable Long id) {
        return eventoService.obtenerDetalleEvento(id);
    }

    @PostMapping("/{id}/inscribir")
    public void inscribirseAlEvento(@PathVariable Long id, @RequestParam Long usuarioId) {
        eventoService.inscribirUsuario(id, usuarioId);
    }
}
