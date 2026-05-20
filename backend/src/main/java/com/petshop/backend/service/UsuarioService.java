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
        // Valida e-mail duplicado
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("E-mail já cadastrado.");
        }

        // Valida CPF duplicado
        if (usuarioRepository.findByCpf(usuario.getCpf()).isPresent()) {
            throw new RuntimeException("CPF já cadastrado.");
        }

        // ⚠️ Aqui futuramente você vai hashear a senha com BCrypt
        // Por agora salva direto
        return usuarioRepository.save(usuario);
    }
}