package com.petshop.backend.controller;

import com.petshop.backend.model.Agendamento;
import com.petshop.backend.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@CrossOrigin(origins = "*")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    // GET /agendamentos — lista todos (já existia)
    @GetMapping
    public List<Agendamento> listarTodos() {
        return agendamentoService.listarTodos();
    }

    // POST /agendamentos — salva COM validação de choque
    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Agendamento agendamento) {
        try {
            Agendamento salvo = agendamentoService.salvar(agendamento);
            return ResponseEntity.ok(salvo);
        } catch (RuntimeException e) {
            // Retorna 409 Conflict com a mensagem de erro
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    // DELETE /agendamentos/{id} — já existia
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable long id) {
        agendamentoService.deletar(id);
    }

    // GET /agendamentos/horarios-disponiveis
    // Exemplo: /agendamentos/horarios-disponiveis?funcionarioId=1&data=2026-05-10&duracao=60
    @GetMapping("/horarios-disponiveis")
    public ResponseEntity<?> getHorariosDisponiveis(
        @RequestParam Long funcionarioId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
        @RequestParam(defaultValue = "60") int duracao
    ) {
        List<String> horarios = agendamentoService
            .getHorariosDisponiveis(funcionarioId, data, duracao);
        return ResponseEntity.ok(horarios);
    }
}