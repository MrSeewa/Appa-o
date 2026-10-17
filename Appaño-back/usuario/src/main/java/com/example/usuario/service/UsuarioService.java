package com.example.usuario.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
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

    @Value("${storage.location}")
    private String uploadDir;

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

    public String guardarFotoPerfil(Long id_usuario, MultipartFile file) throws IOException {
        Usuario usuario = usuarioRepository.findById(id_usuario).orElse(null);
        if (usuario == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado con esa id");
        }
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El archivo está vacío");
        }

        // 1. Crear el directorio de almacenamiento si no existe
        Path pathDir = Paths.get(uploadDir);
        if (!Files.exists(pathDir)) {
            Files.createDirectories(pathDir);
        }

        // 2. Crear un nombre único para evitar colisiones
        String nombreOriginal = file.getOriginalFilename();
        String extension = "";
        if (nombreOriginal != null && nombreOriginal.contains(".")) {
            extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
        } else {
            extension = ".jpg";
        }
        String nuevoNombre = UUID.randomUUID().toString() + extension;

        // 3. Guardar el archivo en el disco
        Path pathFinal = pathDir.resolve(nuevoNombre);
        Files.copy(file.getInputStream(), pathFinal, StandardCopyOption.REPLACE_EXISTING);

        // 4. Registrar la URL accesible en la base de datos
        String urlFoto = "http://localhost:8080/api/usuarios/uploads/" + nuevoNombre;
        usuario.setFotoPerfil(urlFoto);
        usuarioRepository.save(usuario);

        return urlFoto;
    }

    public Resource cargarFotoComoRecurso(String nombreArchivo) {
        try {
            Path pathArchivo = Paths.get(uploadDir).resolve(nombreArchivo).normalize();
            Resource recurso = new UrlResource(pathArchivo.toUri());
            if (recurso.exists() && recurso.isReadable()) {
                return recurso;
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Foto no encontrada: " + nombreArchivo);
            }
        } catch (MalformedURLException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ruta de archivo inválida", e);
        }
    }
}
