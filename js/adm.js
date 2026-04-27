const tabelaElemento = document.querySelector(".tabela");
const tipo = tabelaElemento.dataset.tipo;

if (tipo === "agendamentos") {
    console.log("Tabela de agendamentos");
}

if (tipo === "pacientes") {
    console.log("Tabela de pacientes");
}

if (tipo === "funcionarios") {
    console.log("Tabela de funcionários");
}


/* --------------------- clica bo botao pra esclher a tabela e troca de cor --------------------- */

const botoes = document.querySelectorAll(".navAside");

botoes.forEach(botao => {
  botao.addEventListener("click", (e) => {
    e.preventDefault();

    const tipo = botao.dataset.tipo;

    console.log("clicou");

    botoes.forEach(b => b.classList.remove("ativo"));
    botao.classList.add("ativo");

    renderizarTabela(tipo);

  });
});

/* --------------------- Tabela ADM --------------------- */

const corpoTabela = document.getElementById("conteudo-tabela");
const tituloTabela = document.getElementById("tituloTabela");
const subTituloTabela = document.getElementById("subTituloTabela");

const dados = {
  agendamentos: [
    {
      pet: "Thor",
      especie: "cão",
      raca: "caramelo",
      tutor: "João Silva",
      telefone: "11 987788484",
      servico: "Banho",
      profissional: "Dra. Ana Silva",
      data: "24/04/2026",
      hora: "14:00",
      status: "Confirmado",
      acoes: "excluir e etc"
    }
  ],

  pacientes:[
    {
      pet: "Thor",
      especie: "cão",
      idade: "3",
      raca: "caramelo",
      tutor: "João Silva",
      telefone: "11 987788484",
      visitas: "2",
      data: "24/04/2026",
      acoes: "excluir e etc"
    }
  ],

  funcionarios:[
    {
        nome: "Dra. Ana Maria",
        email: "anaMaria@medipet.com",
        cargo: "Veterinario",
        especialidade: "clinico geral",
        statusFunc: "ativo",
        acoes: "excluir e etc"
    }
  ]


};

const cabecalho = document.getElementById("cabecalho-tabela");

function renderizarTabela(tipo) {


    corpoTabela.innerHTML = "";
    tituloTabela.innerHTML = "";
    subTituloTabela.innerHTML = "";

    if (tipo === "agendamentos") {


        cabecalho.innerHTML = `
      <tr>
        <th>Pet</th>
        <th>Tutor</th>
        <th>Serviço</th>
        <th>Profissional</th>
        <th>Data/Hora</th>
        <th>Status</th>
        <th>Ações</th>
      </tr>
    `;

    corpoTabela.innerHTML = "";

    tituloTabela.textContent = "Agendamento";
    subTituloTabela.textContent = "Gerencie todos os agendamentos da clínica";

    dados.agendamentos.forEach(item => {

        
        corpoTabela.innerHTML += `
        <tr>
            <td>
                <div class="titulo">${item.pet}</div>
                <div class="sub">${item.especie}</div>
            </td>
            <td>
                <div class="titulo">${item.tutor}</div>
                <div class="sub">${item.telefone}</div>
            </td>
            <td>${item.servico}</td>
            <td>${item.profissional}</td>
            <td>
                <div class="titulo">${item.data}</div>
                <div class="sub">${item.hora}</div>
            </td>
            <td>${item.status}</td>
            <td>${item.acoes}</td>
        </tr>
        `;
    });

    }else if( tipo === "pacientes"){


        corpoTabela.innerHTML = "";
        

        cabecalho.innerHTML = `
        <tr>
            <th>Pet</th>
            <th>Raça</th>
            <th>Idade</th>
            <th>Tutor</th>
            <th>Ultima Visita</th>
            <th>Total de Visitas</th>
            <th>Ações</th>
        </tr>
        `;

        corpoTabela.innerHTML = "";

        tituloTabela.textContent = "Pacientes";
        subTituloTabela.textContent = "Visualize e gerencie os pacientes cadastrados";

        dados.pacientes.forEach(item => {
        corpoTabela.innerHTML += `
        <tr>
            <td>
                <div class="titulo">${item.pet}</div>
                <div class="sub">${item.especie}</div>
            </td>
            <td>${item.raca}</td>
            <td>${item.idade}</td>
            <td>
                <div class="titulo">${item.tutor}</div>
                <div class="sub">${item.telefone}</div>
            </td>
            <td>${item.data}</td>
            <td>${item.visitas}</td>
            <td>${item.acoes}</td>
        </tr>
        `;
    });

    }else if(tipo === "funcionarios"){
        
        corpoTabela.innerHTML = "";

        cabecalho.innerHTML = `
        <tr>
            <th>Funcionario</th>
            <th>cargo</th>
            <th>Especialidade</th>
            <th>Status</th>
            <th>Ações</th>
            
        </tr>
        `;

        corpoTabela.innerHTML = "";

        tituloTabela.textContent = "Funcionários";
        subTituloTabela.textContent = "Busque funcionários e visualize suas escalas";

        dados.funcionarios.forEach(item => {
        corpoTabela.innerHTML += `
        <tr>
            <td>
                <div class="titulo">${item.nome}</div>
                <div class="sub">${item.email}</div>
            </td>
            <td>${item.cargo}</td>
            <td>${item.especialidade}</td>
            <td>${item.statusFunc}</td>
            <td>${item.acoes}</td>
        </tr>
        `;
    });

    }
}          