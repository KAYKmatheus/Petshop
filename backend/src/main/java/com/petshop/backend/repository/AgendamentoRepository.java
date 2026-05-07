package com.petshop.backend.repository;

import com.petshop.backend.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // Busca todos agendamentos de um funcionário numa data (excluindo cancelados)
    List<Agendamento> findByFuncionarioIdAndDataAndStatusNot(
        Long funcionarioId,
        LocalDate data,
        String status
    );
}