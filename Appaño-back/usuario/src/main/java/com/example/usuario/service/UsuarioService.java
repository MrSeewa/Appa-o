package com.example.usuario.service;

import com.example.usuario.UsuarioApplication;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.usuario.models.entities.Usuario;
import com.example.usuario.repository.UsuarioRepository;

@Service
public class UsuarioService {

    
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerUsuariosPorId(Long id_usuario) {
        Usuario usuario = usuarioRepository.findById(id_usuario).orElse(null);
        if (usuario == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con esa id");
        }
        return usuario;
    }

    public Usuario agregarUsuario(Usuario nuevoUsuario){
        Usuario usuario = new Usuario();
        usuario.setNombre(nuevoUsuario.getNombre());
        usuario.setApodo(nuevoUsuario.getApodo());
        usuario.setCorreo(nuevoUsuario.getCorreo());
        usuario.setPassword(nuevoUsuario.getPassword());
        usuario.setFotoPerfil(nuevoUsuario.getFotoPerfil());
        usuario.setBiografia(nuevoUsuario.getBiografia());
        usuario.setRol(nuevoUsuario.getRol());

        return usuarioRepository.save(usuario);
    }

    public String eliminarusuario(Long id_usuario){
        if (usuarioRepository.existsById(id_usuario)){
            usuarioRepository.deleteById(id_usuario);
            return "Usuario eliminado correctamente";
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con esa id");
        }
    }

    public Usuario actualizarUsuario(Usuario nuevoUsuario){
        Usuario usuario = usuarioRepository.findById(nuevoUsuario.getId_usuario()).orElse(null);
        if (usuario == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con esa id");
        }
        usuario.setNombre(nuevoUsuario.getNombre());
        usuario.setApodo(nuevoUsuario.getApodo());
        usuario.setCorreo(nuevoUsuario.getCorreo());
        usuario.setPassword(nuevoUsuario.getPassword());
        usuario.setFotoPerfil(nuevoUsuario.getFotoPerfil());
        usuario.setBiografia(nuevoUsuario.getBiografia());
        usuario.setRol(nuevoUsuario.getRol());

        return usuarioRepository.save(usuario);
    }

}
