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

    fetch("http://localhost:8080/agendamentos")
        .then(response => response.json())
        .then(dados => {
            dados.forEach(item => {

            
            corpoTabela.innerHTML += `
            <tr>
                <td>
                    <div class="titulo">${item.pet.nome}</div>
                    <div class="sub">${item.pet.especie}</div>
                </td>
                <td>
                    <div class="titulo">${item.pet.nomeTutor}</div>
                    <div class="sub">${item.pet.telefone}</div>
                </td>
                <td>${item.servico}</td>
                <td>${item.profissional}</td>
                <td>
                    <div class="titulo">${formatarData(item.data)}</div>
                    <div class="sub">${item.hora}</div>
                </td>
                <td>${item.status}</td>

                <td>
                    <button class="botaoEditar" onclick="editarAgendamento(${item.id})">
                        <span class="material-symbols-outlined">edit</span>
                    </button>

                    <button class="botaoDeletar" onclick="deletarAgendamento(${item.id})">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </td>

            </tr>
            `;
        });

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

        fetch("http://localhost:8080/pets")
        .then(response => response.json())
        .then(dados => {
            dados.forEach(item => {
            corpoTabela.innerHTML += `
            <tr>
                <td>
                    <div class="titulo">${item.nome}</div>
                    <div class="sub">${item.especie}</div>
                </td>
                <td>${item.raca}</td>
                <td>${item.idade} anos</td>
                <td>
                    <div class="titulo">${item.nomeTutor}</div>
                    <div class="sub">${item.telefone}</div>
                </td>
                <td>${formatarData(item.ultimaVisita)}</td>
                <td>${item.visitas}</td>

                <td>
                    <button class="botaoEditar" onclick="editarPet(${item.id})">
                        <span class="material-symbols-outlined">edit</span>
                    </button>

                    <button class="botaoDeletar" onclick="deletarPet(${item.id})">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </td>
    

            </tr>
            `;
            });
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

        fetch("http://localhost:8080/funcionarios")
        .then(response => response.json())
        .then(dados => {
            dados.forEach(item => {
            corpoTabela.innerHTML += `
            <tr>
                <td>
                    <div class="titulo">${item.nome}</div>
                    <div class="sub">${item.email}</div>
                </td>
                <td>${item.cargo}</td>
                <td>${item.especialidade}</td>
                <td>${item.status}</td>

                <td>
                <button class="botaoEditar" onclick="editarFuncionario(${item.id})">
                    <span class="material-symbols-outlined">edit</span>
                </button>

                <button class="botaoDeletar" onclick="deletarFuncionario(${item.id})">
                    <span class="material-symbols-outlined">delete</span>
                </button>
                </td>

            </tr>
            `;
        });

    });

    }
} 

function deletarPet(id) {
    if (confirm("Deseja realmente excluir este pet?")) {
        fetch(`http://localhost:8080/pets/${id}`, {
            method: "DELETE"
        }).then(() => renderizarTabela("pacientes"));
    }
}

function deletarFuncionario(id) {
    if (confirm("Deseja realmente excluir este funcionário?")) {
        fetch(`http://localhost:8080/funcionarios/${id}`, {
            method: "DELETE"
        }).then(() => renderizarTabela("funcionarios"));
    }
}

function deletarAgendamento(id) {
    if (confirm("Deseja realmente excluir este agendamento?")) {
        fetch(`http://localhost:8080/agendamentos/${id}`, {
            method: "DELETE"
        }).then(() => renderizarTabela("agendamentos"));
    }
}

function formatarData(valor) {
  if (!valor) return "";
  const data = new Date(valor);
  return isNaN(data) ? "" : data.toLocaleDateString("pt-BR");
}