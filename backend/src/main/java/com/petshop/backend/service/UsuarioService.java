package com.petshop.backend.service;

import com.petshop.backend.model.Usuario;
import com.petshop.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario cadastrar(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado.");
        }
        if (usuarioRepository.findByCpf(usuario.getCpf()).isPresent()) {
            throw new RuntimeException("CPF já cadastrado.");
        }
        return usuarioRepository.save(usuario);
    }

    // Método que o Controller está procurando
    public Usuario login(String email, String senha) {
        Usuario usuarioEncontrado = usuarioRepository.findByEmail(email).orElse(null);
        if (usuarioEncontrado != null && usuarioEncontrado.getSenha().equals(senha)) {
            return usuarioEncontrado;
        }
        throw new RuntimeException("E-mail ou senha incorretos.");
    }
}