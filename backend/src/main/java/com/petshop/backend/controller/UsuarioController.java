package com.petshop.backend.controller;

import com.petshop.backend.model.Usuario;
import com.petshop.backend.model.Pet;
import com.petshop.backend.service.UsuarioService;
import com.petshop.backend.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PetRepository petRepository;

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Usuario usuario) {
        try {
            Usuario salvo = usuarioService.cadastrar(usuario);
            return ResponseEntity.ok(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario credenciais) {
        try {
            // 1. Valida usuário
            Usuario usuarioLogado = usuarioService.login(credenciais.getEmail(), credenciais.getSenha());
            
            // 2. Busca o pet associado a este usuário pelo ID
            Pet petDoUsuario = petRepository.findByUsuarioId(usuarioLogado.getId()).orElse(null);
            
            // 3. Monta o objeto de resposta com os dois dados
            Map<String, Object> resposta = new HashMap<>();
            resposta.put("usuario", usuarioLogado);
            resposta.put("pet", petDoUsuario);
            
            return ResponseEntity.ok(resposta);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}