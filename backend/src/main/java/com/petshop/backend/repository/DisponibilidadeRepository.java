package com.petshop.backend.repository;

import com.petshop.backend.model.Disponibilidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DisponibilidadeRepository extends JpaRepository<Disponibilidade, Long> {

    // Busca todos os blocos de disponibilidade de um funcionário num dia da semana
    List<Disponibilidade> findByFuncionarioIdAndDiaSemana(Long funcionarioId, Integer diaSemana);
}
