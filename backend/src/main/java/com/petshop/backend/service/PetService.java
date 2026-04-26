package com.petshop.backend.service;

import com.petshop.backend.model.Pet;
import com.petshop.backend.repository.PetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service

public class PetService {

    @Autowired

    private PetRepository petRepository;

    public List<Pet> listarTodos(){
        return petRepository.findAll();
    }

    public Pet salvar (Pet pet){
        return petRepository.save(pet);
    }

    public void deletar(long id){
        petRepository.deleteById(id);
    }
}
