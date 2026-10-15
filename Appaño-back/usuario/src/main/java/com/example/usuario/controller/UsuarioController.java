package com.example.usuario.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.usuario.models.entities.Usuario;
import com.example.usuario.service.UsuarioService;


@RequestMapping("usuarios")
@Controller 
public class UsuarioController {
    
    @Autowired 
    private UsuarioService usuarioService;

    @GetMapping("")
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioService.obtenerTodosLosUsuarios();
    }

    @GetMapping("{id_usuario}")
    public Usuario obtenerUsuarioPorId(@PathVariable Long id_usuario) {
        return usuarioService.obtenerUsuariosPorId(id_usuario);
    }

    @PostMapping("")
    public Usuario agregarUsuario(@RequestBody Usuario nuevoUsuario) {
        return usuarioService.agregarUsuario(nuevoUsuario);
    }

    @PostMapping("{id_usuario}")
    public Usuario actualizarUsuario(@PathVariable Long id_usuario, @RequestBody Usuario nuevoUsuario) {
        nuevoUsuario.setId_usuario(id_usuario);
        return usuarioService.actualizarUsuario(nuevoUsuario);
    }

    @DeleteMapping ("{id_usuario}")
    public String eliminarUsuario(@PathVariable Long id_usuario) {
        return usuarioService.eliminarusuario(id_usuario);
    }

}
