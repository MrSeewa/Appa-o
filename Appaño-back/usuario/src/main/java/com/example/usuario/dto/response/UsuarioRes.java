package com.example.usuario.dto.response;

import java.time.LocalDateTime;

import com.example.usuario.models.entities.Usuario;
import com.example.usuario.models.enums.RolUsuario;

import lombok.Data;

@Data
public class UsuarioRes {

    public UsuarioRes() {
    }

    private Long id_usuario;
    private Long id;
    private String nombre;
    private String apodo;
    private String correo;
    private String fotoPerfil;
    private String biografia;
    private RolUsuario rol;
    private LocalDateTime fechaRegistro;

    public static UsuarioRes fromEntity(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        UsuarioRes res = new UsuarioRes();
        res.setId_usuario(usuario.getId_usuario());
        res.setId(usuario.getId_usuario());
        res.setNombre(usuario.getNombre());
        res.setApodo(usuario.getApodo());
        res.setCorreo(usuario.getCorreo());
        res.setFotoPerfil(usuario.getFotoPerfil());
        res.setBiografia(usuario.getBiografia());
        res.setRol(usuario.getRol());
        res.setFechaRegistro(usuario.getFechaRegistro());
        return res;
    }
}
