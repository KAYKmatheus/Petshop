let agendamento = {
  servico: null,
  data: null,
  horario: null
};

// trocar telas
function irParaTela(num) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById("tela" + num).classList.add("ativa");

  atualizarStepper(num); // 👈 ESSA LINHA
}

// selecionar serviço
const botoesServico = document.querySelectorAll(".btn-servico");

botoesServico.forEach(btn => {
  btn.addEventListener("click", function () {
    botoesServico.forEach(b => b.classList.remove("selecionado"));

    this.classList.add("selecionado");
    agendamento.servico = this.innerText;
  });
});

// botão continuar tela 1
document.getElementById("btnTela2").onclick = function () {
  if (!agendamento.servico) {
    alert("Escolha um serviço");
    return;
  }

  irParaTela(2);
};

// botão voltar
document.getElementById("voltar1").onclick = () => irParaTela(1);
document.getElementById("voltar2").onclick = () => irParaTela(2);

//  calendário
flatpickr("#calendario", {
     inline: true,
  minDate: "today",
  dateFormat: "d/m/Y",
  onChange: function (selectedDates, dateStr) {
    agendamento.data = dateStr;
  }
});

//  gerar horários
const horariosManha = ["08:00","09:00","10:00","11:00"];
const horariosTarde = ["13:00","14:00","15:00","16:00"];

function criarBotoes(lista, containerId) {
  const container = document.getElementById(containerId);

  lista.forEach(hora => {
    const btn = document.createElement("button");
    btn.innerText = hora;

    btn.addEventListener("click", function () {
      document.querySelectorAll("#tela2 button").forEach(b => b.classList.remove("selecionado"));

      this.classList.add("selecionado");
      agendamento.horario = hora;
    });

    container.appendChild(btn);
  });
}

criarBotoes(horariosManha, "manha");
criarBotoes(horariosTarde, "tarde");

// ir para tela 3
document.getElementById("btnTela3").onclick = function () {
  if (!agendamento.data || !agendamento.horario) {
    alert("Escolha data e horário");
    return;
  }

  document.getElementById("resServico").innerText = agendamento.servico;
  document.getElementById("resData").innerText = agendamento.data;
  document.getElementById("resHorario").innerText = agendamento.horario;

  irParaTela(3);
};

// confirmar
document.getElementById("confirmar").onclick = function () {
  console.log("Enviando para o backend:", agendamento);
  alert("Agendamento realizado!");
};

// stepper
function atualizarStepper(etapaAtual) {

  const steps = [1, 2, 3];

  steps.forEach(num => {
    const step = document.getElementById("step" + num);

    step.classList.remove("ativo", "concluido");

    if (num < etapaAtual) {
      step.classList.add("concluido");
    } else if (num === etapaAtual) {
      step.classList.add("ativo");
    }
  });
}