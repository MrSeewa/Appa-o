package com.example.usuario.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.usuario.dto.request.UsuarioRegistroReq;
import com.example.usuario.dto.response.UsuarioRes;
import com.example.usuario.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping({"/usuarios", "/api/usuarios"})
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioRes>> obtenerTodosLosUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodosLosUsuarios());
    }

    @GetMapping("/{id_usuario}")
    public ResponseEntity<UsuarioRes> obtenerUsuarioPorId(@PathVariable Long id_usuario) {
        return ResponseEntity.ok(usuarioService.obtenerUsuariosPorId(id_usuario));
    }

    @PostMapping
    public ResponseEntity<UsuarioRes> agregarUsuario(@Valid @RequestBody UsuarioRegistroReq nuevoUsuario) {
        UsuarioRes creado = usuarioService.agregarUsuario(nuevoUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id_usuario}")
    public ResponseEntity<UsuarioRes> actualizarUsuario(
            @PathVariable Long id_usuario,
            @Valid @RequestBody UsuarioRegistroReq usuarioActualizar) {
        return ResponseEntity.ok(usuarioService.actualizarUsuario(id_usuario, usuarioActualizar));
    }

    @DeleteMapping("/{id_usuario}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable Long id_usuario) {
        return ResponseEntity.ok(usuarioService.eliminarusuario(id_usuario));
    }
}
