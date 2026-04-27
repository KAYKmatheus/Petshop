package com.petshop.backend.controller;

import com.petshop.backend.model.Agendamento;
import com.petshop.backend.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@CrossOrigin(origins = "*")

public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @GetMapping
    public List<Agendamento> listarTodos(){
        return agendamentoService.listarTodos();
    }

    @PostMapping
    public Agendamento salvar(@RequestBody Agendamento agendamento){
        return agendamentoService.salvar(agendamento);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable long id){
        agendamentoService.deletar(id);
    }
}
