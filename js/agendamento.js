// --- VERIFICAÇÃO DE LOGIN (Impede acesso sem logar) ---
const usuarioLogado = localStorage.getItem('usuarioLogado');
if (!usuarioLogado) {
    alert("Você precisa estar logado para fazer um agendamento.");
    window.location.href = 'login.html';
}

const petNome = localStorage.getItem('petNomeLogado') || "Seu pet";
const petId = localStorage.getItem('petIdLogado') || 1;
// ------------------------------------------------------

// ─── Estado do agendamento ──────────────────────────────────────
const agendamento = {
  servico: null,
  data: null,         
  dataFormatada: null, 
  horario: null,
  funcionarioId: null,
  funcionarioNome: null,
  duracaoMinutos: 30
};

const duracaoServico = {
  "Clínico Geral": 30,
  "Banho e Tosa": 30
};

const BASE_URL = "http://localhost:8080";

// ─── Navegação entre telas ──────────────────────────────────────
function irParaTela(num) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById("tela" + num).classList.add("ativa");
  atualizarStepper(num);
}

function atualizarStepper(etapaAtual) {
  [1, 2, 3].forEach(num => {
    const step = document.getElementById("step" + num);
    step.classList.remove("ativo", "concluido");
    if (num < etapaAtual) step.classList.add("concluido");
    else if (num === etapaAtual) step.classList.add("ativo");
  });
}

// ─── Tela 1 — Seleção de serviço ────────────────────────────────
const botoesServico = document.querySelectorAll(".btn-servico");

botoesServico.forEach(btn => {
  btn.addEventListener("click", function () {
    botoesServico.forEach(b => b.classList.remove("selecionado"));
    this.classList.add("selecionado");
    agendamento.servico = (this.querySelector(".titulo")?.innerText || this.innerText).trim();
    agendamento.duracaoMinutos = duracaoServico[agendamento.servico] || 60;
  });
});

document.getElementById("btnTela2").onclick = function () {
  if (!agendamento.servico) {
    mostrarAlerta("Escolha um serviço para continuar.", "tela1");
    return;
  }
  irParaTela(2);
};

// ─── Tela 2 — Calendário e horários ─────────────────────────────
async function buscarFuncionarioPorServico(servico) {
  try {
    const res = await fetch(`${BASE_URL}/funcionarios`);
    const funcionarios = await res.json();
    const servicoLimpo = servico.trim().toLowerCase();

    const cargoMap = {
      "clínico geral": ["veterinário", "veterinária"],
      "banho e tosa": ["tosador", "tosadora", "banhista"]
    };
    
    const cargosAceitos = cargoMap[servicoLimpo] || [];

    return funcionarios.find(f => {
      const cargoNoBanco = f.cargo ? f.cargo.trim().toLowerCase() : "";
      const statusNoBanco = f.status ? f.status.trim().toLowerCase() : "";
      return cargosAceitos.includes(cargoNoBanco) && statusNoBanco === "ativo";
    }) || null;

  } catch (err) {
    console.error("Erro ao buscar funcionários:", err);
    return null;
  }
}

async function buscarHorariosDisponiveis(funcionarioId, data, duracao) {
  try {
    const res = await fetch(
      `${BASE_URL}/agendamentos/horarios-disponiveis?funcionarioId=${funcionarioId}&data=${data}&duracao=${duracao}`
    );
    if (!res.ok) return [];
    return await res.json(); 
  } catch (err) {
    console.error("Erro ao buscar horários:", err);
    return [];
  }
}

async function renderizarHorarios(data) {
  const containerManha = document.getElementById("manha");
  const containerTarde = document.getElementById("tarde");

  containerManha.innerHTML = "<p class='carregando'>Buscando horários...</p>";
  containerTarde.innerHTML = "";

  const funcionario = await buscarFuncionarioPorServico(agendamento.servico);

  if (!funcionario) {
    containerManha.innerHTML = "<p class='sem-horarios'>Nenhum profissional disponível para este serviço.</p>";
    return;
  }

  agendamento.funcionarioId = funcionario.id;
  agendamento.funcionarioNome = funcionario.nome;

  const horarios = await buscarHorariosDisponiveis(
    funcionario.id,
    data,
    agendamento.duracaoMinutos
  );

  containerManha.innerHTML = "";
  containerTarde.innerHTML = "";

  if (horarios.length === 0) {
    containerManha.innerHTML = "<p class='sem-horarios'>Nenhum horário disponível nesta data.</p>";
    return;
  }

  const dataAtualObj = new Date();
  const ano = dataAtualObj.getFullYear();
  const mes = String(dataAtualObj.getMonth() + 1).padStart(2, '0');
  const dia = String(dataAtualObj.getDate()).padStart(2, '0');
  const dataDeHoje = `${ano}-${mes}-${dia}`;
  
  const horaAtual = dataAtualObj.getHours();
  const minutoAtual = dataAtualObj.getMinutes();

  let horariosRenderizados = 0; 

  horarios.forEach(hora => {
    const [h, m] = hora.split(":").map(Number);

    if (data === dataDeHoje) {
      if (h < horaAtual || (h === horaAtual && m <= minutoAtual)) {
        return; 
      }
    }

    horariosRenderizados++;

    const btn = document.createElement("button");
    btn.innerText = hora;
    btn.className = "btn-horario";

    btn.addEventListener("click", function () {
      document.querySelectorAll(".btn-horario").forEach(b => b.classList.remove("selecionado"));
      this.classList.add("selecionado");
      agendamento.horario = hora;
    });

    if (h < 12) containerManha.appendChild(btn);
    else containerTarde.appendChild(btn);
  });

  if (horariosRenderizados === 0) {
    containerManha.innerHTML = "<p class='sem-horarios'>O expediente já encerrou ou não há mais horários disponíveis para hoje.</p>";
  }
}

flatpickr("#calendario", {
  inline: true,
  minDate: "today",
  dateFormat: "Y-m-d", 
  locale: {
    firstDayOfWeek: 0,
    weekdays: {
      shorthand: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      longhand: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    },
    months: {
      shorthand: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      longhand: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    }
  },
  onChange: async function (selectedDates, dateStr) {
    if (!selectedDates.length) return; 
    agendamento.data = dateStr;
    agendamento.dataFormatada = selectedDates[0].toLocaleDateString("pt-BR");
    agendamento.horario = null; 
    await renderizarHorarios(dateStr);
  }
});

// Botão continuar tela 2
document.getElementById("btnTela3").onclick = function () {
  if (!agendamento.data) {
    mostrarAlerta("Escolha uma data.", "tela2");
    return;
  }
  if (!agendamento.horario) {
    mostrarAlerta("Escolha um horário.", "tela2");
    return;
  }

  // Preenche resumo na tela 3 usando o nome do Pet salvo no login
  document.getElementById("resPet").innerText = petNome; 
  document.getElementById("resServico").innerText = agendamento.servico;
  document.getElementById("resProfissional").innerText = agendamento.funcionarioNome || "—";
  document.getElementById("resData").innerText = agendamento.dataFormatada;
  document.getElementById("resHorario").innerText = agendamento.horario;

  irParaTela(3);
};

document.getElementById("voltar1").onclick = () => irParaTela(1);
document.getElementById("voltar2").onclick = () => irParaTela(2);

// ─── Tela 3 — Confirmar agendamento ─────────────────────────────
document.getElementById("confirmar").onclick = async function () {
  const btn = document.getElementById("confirmar");
  btn.disabled = true;
  btn.innerText = "Enviando...";

  try {
    const payload = {
      servico: agendamento.servico,
      data: agendamento.data,
      hora: agendamento.horario + ":00", 
      duracaoMinutos: agendamento.duracaoMinutos,
      status: "Confirmado",
      funcionario: { id: agendamento.funcionarioId },
      pet: { id: petId } // Vincula o agendamento ao pet do usuário
    };

    const res = await fetch(`${BASE_URL}/agendamentos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      mostrarSucesso();
    } else {
      const erro = await res.text();
      mostrarAlerta("⚠️ " + erro, "tela3");
      btn.disabled = false;
      btn.innerText = "Confirmar Agendamento";
    }

  } catch (err) {
    mostrarAlerta("Erro ao conectar com o servidor. Tente novamente.", "tela3");
    btn.disabled = false;
    btn.innerText = "Confirmar Agendamento";
  }
};

function mostrarAlerta(mensagem, telaId) {
  document.querySelectorAll(".alerta-erro").forEach(a => a.remove());

  const div = document.createElement("div");
  div.className = "alerta-erro";
  div.textContent = mensagem;

  const tela = document.getElementById(telaId);
  tela?.querySelector(".card")?.prepend(div);

  setTimeout(() => div.remove(), 4000);
}

function mostrarSucesso() {
  const container = document.querySelector(".container");
  container.innerHTML = `
    <div class="sucesso-container">
      <div class="sucesso-icone">✅</div>
      <h2>Agendamento confirmado!</h2>
      <p>Seu agendamento de <strong>${agendamento.servico}</strong> foi marcado para 
         <strong>${agendamento.dataFormatada}</strong> às <strong>${agendamento.horario}</strong>
         com <strong>${agendamento.funcionarioNome}</strong>.</p>
      <a href="index.html" class="btn-principal">Voltar para o início</a>
    </div>
  `;
}