package com.petshop.backend.controller;

import com.petshop.backend.model.Pet;
import com.petshop.backend.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pets")
@CrossOrigin(origins = "*")

public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping
    public List<Pet> listarTodos(){
        return petService.listarTodos();
    }

    @PostMapping
    public Pet salvar(@RequestBody Pet pet){
        return petService.salvar(pet);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable long id){
        petService.deletar(id);
    }

    @GetMapping("/buscar")
    public List<Pet> buscar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String especie,
            @RequestParam(required = false) Integer idade
    ) {
        return petService.buscar(nome, especie, idade);
    }

}
