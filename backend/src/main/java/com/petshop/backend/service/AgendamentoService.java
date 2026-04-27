package com.petshop.backend.service;


import com.petshop.backend.model.Agendamento;
import com.petshop.backend.repository.AgendamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service

public class AgendamentoService {

    @Autowired

    private AgendamentoRepository agendamentoRepository;

    public List<Agendamento> listarTodos(){
        return agendamentoRepository.findAll();
    }

    public Agendamento salvar (Agendamento agendamento){
        return agendamentoRepository.save(agendamento);
    }

    public void deletar(long id){
        agendamentoRepository.deleteById(id);
    }
}
