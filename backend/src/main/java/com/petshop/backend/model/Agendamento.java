package com.petshop.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "agendamentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    // ← NOVO: vínculo real com funcionário (antes era String profissional)
    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

    private String servico;
    private LocalDate data;
    private LocalTime hora;
    private String status;

    // ← NOVO: duração em minutos (padrão 60)
    private Integer duracaoMinutos = 30;
}