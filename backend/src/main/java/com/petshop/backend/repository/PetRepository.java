package com.petshop.backend.repository;

import com.petshop.backend.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    @Query("SELECT p FROM Pet p WHERE " +
            "(:nome IS NULL OR p.nome LIKE %:nome%) AND " +
            "(:especie IS NULL OR p.especie = :especie) AND " +
            "(:idade IS NULL OR p.idade = :idade)")
    List<Pet> filtrar(@Param("nome") String nome,
                      @Param("especie") String especie,
                      @Param("idade") Integer idade);
}

