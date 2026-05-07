package com.petshop.backend.service;

import com.petshop.backend.model.Agendamento;
import com.petshop.backend.model.Disponibilidade;
import com.petshop.backend.repository.AgendamentoRepository;
import com.petshop.backend.repository.DisponibilidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private DisponibilidadeRepository disponibilidadeRepository;

    // ─── Métodos que você já tinha ────────────────────────────────
    public List<Agendamento> listarTodos() {
        return agendamentoRepository.findAll();
    }

    public void deletar(long id) {
        agendamentoRepository.deleteById(id);
    }

    // ─── Salvar COM validação de choque ───────────────────────────
    public Agendamento salvar(Agendamento agendamento) {
        // Garante status padrão
        if (agendamento.getStatus() == null) {
            agendamento.setStatus("Confirmado");
        }
        // Garante duração padrão
        if (agendamento.getDuracaoMinutos() == null) {
            agendamento.setDuracaoMinutos(60);
        }

        // Valida choque antes de salvar
        verificarChoque(agendamento);

        return agendamentoRepository.save(agendamento);
    }

    // ─── Verifica se há choque de horário ─────────────────────────
    private void verificarChoque(Agendamento novo) {
        if (novo.getFuncionario() == null || novo.getData() == null || novo.getHora() == null) {
            throw new RuntimeException("Funcionário, data e hora são obrigatórios.");
        }

        Long funcionarioId = novo.getFuncionario().getId();
        LocalDate data     = novo.getData();
        LocalTime inicio   = novo.getHora();
        LocalTime fim      = inicio.plusMinutes(novo.getDuracaoMinutos());

        // 1. Verifica se o horário está dentro da disponibilidade
        int diaSemana = data.getDayOfWeek().getValue() % 7; // Converte para 0=Dom...6=Sáb
        List<Disponibilidade> blocos = disponibilidadeRepository
            .findByFuncionarioIdAndDiaSemana(funcionarioId, diaSemana);

        boolean dentroDisponibilidade = blocos.stream().anyMatch(b ->
            !inicio.isBefore(b.getHoraInicio()) && !fim.isAfter(b.getHoraFim())
        );

        if (!dentroDisponibilidade) {
            throw new RuntimeException(
                "O profissional não atende neste horário ou dia da semana."
            );
        }

        // 2. Verifica choque com agendamentos existentes
        List<Agendamento> existentes = agendamentoRepository
            .findByFuncionarioIdAndDataAndStatusNot(funcionarioId, data, "Cancelado");

        for (Agendamento existente : existentes) {
            // Pula o próprio agendamento (em caso de edição)
            if (novo.getId() != null && novo.getId().equals(existente.getId())) continue;

            LocalTime exInicio = existente.getHora();
            LocalTime exFim    = exInicio.plusMinutes(
                existente.getDuracaoMinutos() != null ? existente.getDuracaoMinutos() : 60
            );

            // Há choque se os intervalos se sobrepõem
            boolean choque = inicio.isBefore(exFim) && fim.isAfter(exInicio);
            if (choque) {
                throw new RuntimeException(
                    "Horário " + inicio + " já está ocupado para este profissional."
                );
            }
        }
    }

    // ─── Retorna horários disponíveis para o frontend ─────────────
    public List<String> getHorariosDisponiveis(Long funcionarioId, LocalDate data, int duracaoMinutos) {
        int diaSemana = data.getDayOfWeek().getValue() % 7;

        List<Disponibilidade> blocos = disponibilidadeRepository
            .findByFuncionarioIdAndDiaSemana(funcionarioId, diaSemana);

        if (blocos.isEmpty()) return new ArrayList<>();

        List<Agendamento> agendamentos = agendamentoRepository
            .findByFuncionarioIdAndDataAndStatusNot(funcionarioId, data, "Cancelado");

        List<String> slotsLivres = new ArrayList<>();

        for (Disponibilidade bloco : blocos) {
            LocalTime atual = bloco.getHoraInicio();

            while (!atual.plusMinutes(duracaoMinutos).isAfter(bloco.getHoraFim())) {
                final LocalTime slotInicio = atual;
                final LocalTime slotFim   = atual.plusMinutes(duracaoMinutos);

                boolean ocupado = agendamentos.stream().anyMatch(ag -> {
                    LocalTime agInicio = ag.getHora();
                    LocalTime agFim    = agInicio.plusMinutes(
                        ag.getDuracaoMinutos() != null ? ag.getDuracaoMinutos() : 60
                    );
                    return slotInicio.isBefore(agFim) && slotFim.isAfter(agInicio);
                });

                if (!ocupado) {
                    slotsLivres.add(slotInicio.toString()); // "08:00", "09:00"...
                }

                atual = atual.plusMinutes(30); // Slots de 30 em 30 min
            }
        }

        return slotsLivres;
    }
}