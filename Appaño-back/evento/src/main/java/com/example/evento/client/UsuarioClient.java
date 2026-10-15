package com.example.evento.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.evento.model.response.UsuarioPublicoDTO;

@FeignClient(name = "usuario-service", url = "${usuario.service.url:http://localhost:8080/usuarios}")
public interface UsuarioClient {

    @GetMapping("/{id_usuario}")
    UsuarioPublicoDTO obtenerPerfilCreador(@PathVariable("id_usuario") Long id_usuario);
}

