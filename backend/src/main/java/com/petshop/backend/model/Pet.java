package com.petshop.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table ( name = "pets")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String nome;
    private String especie;
    private String raca;
    private int idade;
    private String nomeTutor;
    private String telefone;
    private int visitas;
    private LocalDate ultimaVisita;
}
