package com.example.usuario.dto.request;

import com.example.usuario.models.enums.RolUsuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UsuarioRegistroReq {

    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotBlank(message = "El apodo no puede estar vacío")
    @Pattern(
        regexp = "^[a-zA-Z0-9_]{3,20}$", 
        message = "El apodo debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos"
    )
    private String apodo;

    @NotBlank(message = "El correo no puede estar vacío")
    @Email(message = "Debe ingresar un formato de correo electrónico válido")
    private String correo;

    @NotBlank(message = "La contraseña no puede estar vacía")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    private String fotoPerfil;

    @Size(max = 500, message = "La biografía no puede superar los 500 caracteres")
    private String biografia;

    private RolUsuario rol;
}

