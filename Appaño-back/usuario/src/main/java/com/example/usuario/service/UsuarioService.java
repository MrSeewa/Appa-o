package com.example.usuario.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.usuario.dto.request.UsuarioRegistroReq;
import com.example.usuario.dto.response.UsuarioRes;
import com.example.usuario.models.entities.Usuario;
import com.example.usuario.models.enums.RolUsuario;
import com.example.usuario.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioRes> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioRes::fromEntity)
                .toList();
    }

    public UsuarioRes obtenerUsuariosPorId(Long id_usuario) {
        Usuario usuario = usuarioRepository.findById(id_usuario).orElse(null);
        if (usuario == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con esa id");
        }
        return UsuarioRes.fromEntity(usuario);
    }

    public UsuarioRes agregarUsuario(UsuarioRegistroReq nuevoUsuario) {
        Usuario usuario = new Usuario();
        String nombre = nuevoUsuario.getNombre();
        if (nuevoUsuario.getApellido() != null && !nuevoUsuario.getApellido().isBlank()) {
            nombre = (nombre != null ? nombre + " " : "") + nuevoUsuario.getApellido().trim();
        }
        usuario.setNombre(nombre);
        usuario.setApodo(nuevoUsuario.getApodo());
        usuario.setCorreo(nuevoUsuario.getCorreo());
        usuario.setPassword(nuevoUsuario.getPassword());
        usuario.setFotoPerfil(nuevoUsuario.getFotoPerfil());
        usuario.setBiografia(nuevoUsuario.getBiografia());
        usuario.setRol(nuevoUsuario.getRol() != null ? nuevoUsuario.getRol() : RolUsuario.USER);

        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return UsuarioRes.fromEntity(usuarioGuardado);
    }

    public String eliminarusuario(Long id_usuario) {
        if (usuarioRepository.existsById(id_usuario)) {
            usuarioRepository.deleteById(id_usuario);
            return "Usuario eliminado correctamente";
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con esa id");
        }
    }

    public UsuarioRes actualizarUsuario(Long id_usuario, UsuarioRegistroReq datosActualizar) {
        Usuario usuario = usuarioRepository.findById(id_usuario).orElse(null);
        if (usuario == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con esa id");
        }
        usuario.setNombre(datosActualizar.getNombre());
        usuario.setApodo(datosActualizar.getApodo());
        usuario.setCorreo(datosActualizar.getCorreo());
        if (datosActualizar.getPassword() != null && !datosActualizar.getPassword().isBlank()) {
            usuario.setPassword(datosActualizar.getPassword());
        }
        usuario.setFotoPerfil(datosActualizar.getFotoPerfil());
        usuario.setBiografia(datosActualizar.getBiografia());
        if (datosActualizar.getRol() != null) {
            usuario.setRol(datosActualizar.getRol());
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return UsuarioRes.fromEntity(usuarioActualizado);
    }
}
