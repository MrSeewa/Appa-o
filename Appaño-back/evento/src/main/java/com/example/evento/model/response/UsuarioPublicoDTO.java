package com.example.evento.model.response;

import lombok.Data;

@Data
public class UsuarioPublicoDTO {

    public UsuarioPublicoDTO() {
    }

    private Long id;
    private Long id_usuario;
    private String nombre;
    private String apodo;
    private String correo;
    private String fotoPerfil;
    private String biografia;
}
