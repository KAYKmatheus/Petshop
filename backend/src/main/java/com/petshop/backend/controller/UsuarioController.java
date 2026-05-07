package com.petshop.backend.controller;

import com.petshop.backend.model.Usuario;
import com.petshop.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Usuario usuario) {
        try {
            Usuario salvo = usuarioService.cadastrar(usuario);
            return ResponseEntity.ok(salvo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }
}