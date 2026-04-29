let indice = 0;
let pontos = 0;
let acertos = 0;
let erros = 0;
let respondeu = false;

const letras = ["A", "B", "C", "D"];

function carregarPergunta() {
  respondeu = false;

  let q = perguntas[indice];

  document.getElementById("contador").innerText =
    "PERGUNTA " + (indice + 1) + " DE " + perguntas.length;

  document.getElementById("pergunta").innerText = (indice + 1) + ". " + q.pergunta;

  document.getElementById("pontos").innerText = pontos;
  document.getElementById("acertos").innerText = acertos;
  document.getElementById("erros").innerText = erros;

  let porcentagem = Math.round((indice / perguntas.length) * 100);
  document.getElementById("progresso").style.width = porcentagem + "%";
  document.getElementById("porcentagem").innerText = porcentagem + "%";

  let html = "";

  q.opcoes.forEach((opcao, i) => {
    html += `
      <button class="resposta" onclick="responder(${i})">
        <span class="letra">${letras[i]}</span>
        <span>${opcao}</span>
      </button>
    `;
  });

  document.getElementById("respostas").innerHTML = html;
  document.getElementById("nextBtn").style.display = "none";
}

function responder(escolha) {
  if (respondeu) return;

  respondeu = true;

  let correta = perguntas[indice].correta;
  let botoes = document.querySelectorAll(".resposta");

  botoes.forEach((botao, i) => {
    botao.disabled = true;

    if (i === correta) {
      botao.classList.add("certa");
    }

    if (i === escolha && escolha !== correta) {
      botao.classList.add("errada");
    }
  });

  if (escolha === correta) {
    pontos += 100;
    acertos++;
  } else {
    erros++;
  }

  document.getElementById("pontos").innerText = pontos;
  document.getElementById("acertos").innerText = acertos;
  document.getElementById("erros").innerText = erros;

  document.getElementById("nextBtn").style.display = "block";
}

function proximaPergunta() {
  indice++;

  if (indice < perguntas.length) {
    carregarPergunta();
  } else {
    finalizarJogo();
  }
}

function finalizarJogo() {
  document.querySelector(".game").style.display = "none";
  document.getElementById("resultado").style.display = "block";

  document.getElementById("resultadoTexto").innerHTML =
    "Sua pontuação: <strong>" + pontos + "</strong><br>" +
    "Acertos: " + acertos + "<br>" +
    "Erros: " + erros;
}

function reiniciar() {
  indice = 0;
  pontos = 0;
  acertos = 0;
  erros = 0;
  respondeu = false;

  document.querySelector(".game").style.display = "block";
  document.getElementById("resultado").style.display = "none";

  carregarPergunta();
}

carregarPergunta();