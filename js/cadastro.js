// ─── Utilitários de validação ───────────────────────────────────

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

function validarTelefone(tel) {
  return /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(tel);
}

function mostrarErro(input, mensagem) {
  limparErro(input);
  input.classList.add('input-erro');
  const span = document.createElement('span');
  span.className = 'msg-erro';
  span.textContent = mensagem;
  input.parentElement.appendChild(span);
}

function limparErro(input) {
  input.classList.remove('input-erro');
  const erroExistente = input.parentElement.querySelector('.msg-erro');
  if (erroExistente) erroExistente.remove();
}

// ─── Máscaras ───────────────────────────────────────────────────

function aplicarMascaraCPF(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = v;
  });
}

function aplicarMascaraTelefone(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) {
      v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    input.value = v;
  });
}

// ─── Validação principal do formulário ─────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

  // Inputs
  const nome        = form.querySelector('input[type="text"]');
  const email       = form.querySelector('input[type="email"]');
  const telefone    = form.querySelector('input[type="tel"]');
  const cpf         = form.querySelectorAll('input[type="text"]')[1];
  const senhas      = form.querySelectorAll('input[type="password"]');
  const senha       = senhas[0];
  const confirma    = senhas[1];
  const nomePet     = form.querySelectorAll('input[type="text"]')[2];
  const especie     = form.querySelector('select');

  // Aplica máscaras
  if (cpf)      aplicarMascaraCPF(cpf);
  if (telefone) aplicarMascaraTelefone(telefone);

  // Limpa erros ao digitar
  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => limparErro(el));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valido = true;

    // Nome
    if (!nome.value.trim() || nome.value.trim().length < 3) {
      mostrarErro(nome, 'Nome deve ter pelo menos 3 caracteres.');
      valido = false;
    }

    // E-mail
    if (!validarEmail(email.value.trim())) {
      mostrarErro(email, 'E-mail inválido.');
      valido = false;
    }

    // Telefone
    if (!validarTelefone(telefone.value.trim())) {
      mostrarErro(telefone, 'Telefone inválido. Use (00) 00000-0000.');
      valido = false;
    }

    // CPF
    if (!validarCPF(cpf.value)) {
      mostrarErro(cpf, 'CPF inválido.');
      valido = false;
    }

    // Senha
    if (senha.value.length < 8) {
      mostrarErro(senha, 'Senha deve ter pelo menos 8 caracteres.');
      valido = false;
    }

    // Confirmar senha
    if (senha.value !== confirma.value) {
      mostrarErro(confirma, 'As senhas não coincidem.');
      valido = false;
    }

    // Nome do pet
    if (!nomePet.value.trim()) {
      mostrarErro(nomePet, 'Informe o nome do pet.');
      valido = false;
    }

    // Espécie
    if (!especie.value) {
      mostrarErro(especie, 'Selecione a espécie.');
      valido = false;
    }

    if (valido) {
      // Aqui vai a chamada para o backend quando estiver pronto
      enviarCadastro(form);
    }
  });
});

// ─── Envia para o backend ───────────────────────────────────────

async function enviarCadastro(form) {
    const inputs = form.querySelectorAll('input[type="text"]');
    const dados = {
        usuario: {
            nome: inputs[0].value.trim(),
            email: form.querySelector('input[type="email"]').value.trim(),
            telefone: form.querySelector('input[type="tel"]').value.trim(),
            cpf: inputs[1].value.replace(/\D/g, ''),
            senha: form.querySelectorAll('input[type="password"]')[0].value
        },
        pet: {
            nome: inputs[2].value.trim(),
            especie: form.querySelector('select').value,
            raca: inputs[3].value.trim(),
            idade: parseInt(inputs[4].value) || 0
        }
    };

    try {
        const res = await fetch('http://localhost:8080/usuarios/cadastro-completo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            alert('Conta e Pet cadastrados com sucesso!');
            window.location.href = 'login.html';
        } else {
            const msg = await res.text();
            alert("Erro: " + msg);
        }
    } catch (err) {
        alert('Erro ao conectar com o servidor.');
    }
}