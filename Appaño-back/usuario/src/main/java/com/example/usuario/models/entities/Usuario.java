package com.example.usuario.models.entities;

import java.time.LocalDateTime;

import com.example.usuario.models.enums.RolUsuario;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "usuarios")
public class Usuario {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_usuario;

    @Column 
    private String nombre;

    @Column 
    private String apodo;

    @Column 
    private String correo;

    //se guardará el hash cifrado jojo
    @Column(nullable = false)
    private String password;

    @Column(name = "foto_perfil")
    private String fotoPerfil;

    @Column(length = 500)
    private String biografia;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RolUsuario rol;

    @Column(name = "fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
    }
}