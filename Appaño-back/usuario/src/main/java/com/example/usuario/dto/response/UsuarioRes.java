package com.example.usuario.dto.response;

import java.time.LocalDateTime;

import com.example.usuario.models.entities.Usuario;
import com.example.usuario.models.enums.RolUsuario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRes {

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
        return UsuarioRes.builder()
                .id_usuario(usuario.getId_usuario())
                .id(usuario.getId_usuario())
                .nombre(usuario.getNombre())
                .apodo(usuario.getApodo())
                .correo(usuario.getCorreo())
                .fotoPerfil(usuario.getFotoPerfil())
                .biografia(usuario.getBiografia())
                .rol(usuario.getRol())
                .fechaRegistro(usuario.getFechaRegistro())
                .build();
    }
}

