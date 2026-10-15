package com.example.evento.model.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class EventoDetalleRes {

    private Long id;
    private String titulo;
    private String descripcion;
    private String categoria;
    private LocalDateTime fechaEvento;
    private UsuarioPublicoDTO creador;
    private Long cantidadInscritos;

    public static class EventoDetalleResBuilder {
        private Long id;
        private String titulo;
        private String descripcion;
        private String categoria;
        private LocalDateTime fechaEvento;
        private UsuarioPublicoDTO creador;
        private Long cantidadInscritos;

        public EventoDetalleResBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public EventoDetalleResBuilder titulo(String titulo) {
            this.titulo = titulo;
            return this;
        }

        public EventoDetalleResBuilder descripcion(String descripcion) {
            this.descripcion = descripcion;
            return this;
        }

        public EventoDetalleResBuilder categoria(String categoria) {
            this.categoria = categoria;
            return this;
        }

        public EventoDetalleResBuilder fechaEvento(LocalDateTime fechaEvento) {
            this.fechaEvento = fechaEvento;
            return this;
        }

        public EventoDetalleResBuilder creador(UsuarioPublicoDTO creador) {
            this.creador = creador;
            return this;
        }

        public EventoDetalleResBuilder cantidadInscritos(Long cantidadInscritos) {
            this.cantidadInscritos = cantidadInscritos;
            return this;
        }

        public EventoDetalleRes build() {
            EventoDetalleRes res = new EventoDetalleRes();
            res.setId(this.id);
            res.setTitulo(this.titulo);
            res.setDescripcion(this.descripcion);
            res.setCategoria(this.categoria);
            res.setFechaEvento(this.fechaEvento);
            res.setCreador(this.creador);
            res.setCantidadInscritos(this.cantidadInscritos);
            return res;
        }
    }

    public static EventoDetalleResBuilder builder() {
        return new EventoDetalleResBuilder();
    }
}
