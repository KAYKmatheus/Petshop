package com.petshop.backend.controller;

import com.petshop.backend.model.Funcionario;
import com.petshop.backend.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/funcionarios")
@CrossOrigin(origins = "*")

public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;

    @GetMapping
    public List<Funcionario> listarTodos(){
        return funcionarioService.listarTodos();
    }

    @PostMapping
    public Funcionario salvar(@RequestBody Funcionario funcionario){
        return funcionarioService.salvar(funcionario);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable long id){
        funcionarioService.deletar(id);
    }
}
