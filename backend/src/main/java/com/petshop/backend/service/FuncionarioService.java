package com.petshop.backend.service;


import com.petshop.backend.model.Funcionario;
import com.petshop.backend.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service

public class FuncionarioService {

    @Autowired

    private FuncionarioRepository funcionarioRepository;

    public List<Funcionario> listarTodos(){
        return funcionarioRepository.findAll();
    }

    public Funcionario salvar (Funcionario funcionario){
        return funcionarioRepository.save(funcionario);
    }

    public void deletar(long id){
        funcionarioRepository.deleteById(id);
    }
}
