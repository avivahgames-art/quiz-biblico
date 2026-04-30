let indice = 0;
let pontos = 0;
let acertos = 0;
let erros = 0;
let respondeu = false;
let tempoInicio = 0;
let pontuacaoSalvaNestaPartida = false;

const letras = ["A", "B", "C", "D"];

function abrirComoJogar() {
  document.getElementById("capa").style.display = "none";
  document.getElementById("tela-como-jogar").style.display = "flex";
}

function fecharComoJogar() {
  document.getElementById("tela-como-jogar").style.display = "none";
  document.getElementById("capa").style.display = "flex";
}

function abrirRanking() {
  document.getElementById("capa").style.display = "none";
  document.getElementById("tela-ranking").style.display = "flex";
  carregarRankingCapa();
}

function fecharRanking() {
  document.getElementById("tela-ranking").style.display = "none";
  document.getElementById("capa").style.display = "flex";
}

function carregarRankingCapa() {
  let ranking = JSON.parse(localStorage.getItem("rankingBiblico")) || [];

  let unico = [];
  let usados = new Set();

  ranking.forEach(item => {
    let chave = item.nome + "-" + item.pontos;
    if (!usados.has(chave)) {
      usados.add(chave);
      unico.push(item);
    }
  });

  let tabela = document.getElementById("rankingCapaTabela");
  tabela.innerHTML = "";

  for (let i = 0; i < 20; i++) {
    let item = unico[i];

    let coroa = "";
    if (i === 0) coroa = "👑";
    if (i === 1) coroa = "👑";
    if (i === 2) coroa = "👑";

    tabela.innerHTML += `
      <tr>
        <td class="rank-posicao">${coroa} ${i + 1}</td>
        <td>${item ? item.nome : ""}</td>
        <td>${item ? item.pontos : ""}</td>
      </tr>
    `;
  }
}

function abrirJogo() {
  let nome = prompt("Digite seu nome para entrar no ranking:");

  if (!nome || nome.trim() === "") {
    nome = "Jogador";
  }

  localStorage.setItem("nomeJogadorAtual", nome.trim());

  document.getElementById("capa").style.display = "none";
  document.getElementById("tela-como-jogar").style.display = "none";
  document.getElementById("tela-ranking").style.display = "none";
  document.getElementById("resultado").style.display = "none";
  document.getElementById("final-biblico").style.display = "none";
  document.getElementById("jogo").style.display = "block";

  reiniciar();
}

function voltarInicio() {
  document.getElementById("jogo").style.display = "none";
  document.getElementById("resultado").style.display = "none";
  document.getElementById("final-biblico").style.display = "none";
  document.getElementById("tela-como-jogar").style.display = "none";
  document.getElementById("tela-ranking").style.display = "none";
  document.getElementById("overlay-acerto").style.display = "none";
  document.getElementById("overlay-erro").style.display = "none";
  document.getElementById("capa").style.display = "flex";
}

function carregarPergunta() {
  respondeu = false;
  let q = perguntas[indice];

  document.getElementById("contador").innerText =
    "PERGUNTA " + (indice + 1) + " DE " + perguntas.length;

  document.getElementById("pergunta").innerText =
    (indice + 1) + ". " + q.pergunta;

  atualizarPlacar();

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
}

function responder(escolha) {
  if (respondeu) return;
  respondeu = true;

  let correta = perguntas[indice].correta;
  let botoes = document.querySelectorAll(".resposta");

  botoes.forEach((botao) => {
    botao.disabled = true;
  });

  if (escolha === correta) {
    botoes[escolha].classList.add("certa");
    pontos += 100;
    acertos++;
    atualizarPlacar();

    setTimeout(() => {
      mostrarAcerto();
    }, 500);
  } else {
    botoes[escolha].classList.add("errada");
    erros++;
    atualizarPlacar();

    setTimeout(() => {
      mostrarErro();
    }, 500);
  }
}

function mostrarAcerto() {
  document.getElementById("overlay-acerto").style.display = "flex";
}

function fecharAcerto() {
  document.getElementById("overlay-acerto").style.display = "none";
  proximaPergunta();
}

function mostrarErro() {
  document.getElementById("overlay-erro").style.display = "flex";
}

function fecharErro() {
  document.getElementById("overlay-erro").style.display = "none";
  proximaPergunta();
}

function proximaPergunta() {
  indice++;

  if (indice < perguntas.length) {
    carregarPergunta();
  } else {
    finalizarJogo();
  }
}

function calcularEstrelas() {
  let percentual = (acertos / perguntas.length) * 100;

  if (percentual === 100) return 5;
  if (percentual >= 90) return 4;
  if (percentual >= 80) return 3;
  if (percentual >= 70) return 2;
  return 1;
}

function calcularRank() {
  let percentual = (acertos / perguntas.length) * 100;

  if (percentual === 100) return "OURO";
  if (percentual >= 90) return "PRATA";
  if (percentual >= 80) return "BRONZE";
  if (percentual >= 70) return "APRENDIZ";
  return "INICIANTE";
}

function formatarTempo(segundos) {
  let min = Math.floor(segundos / 60);
  let seg = segundos % 60;

  return String(min).padStart(2, "0") + ":" + String(seg).padStart(2, "0");
}

function atualizarRankingFinal() {
  let ranking = JSON.parse(localStorage.getItem("rankingBiblico")) || [];
  let nomeJogador = localStorage.getItem("nomeJogadorAtual") || "Jogador";

  ranking.push({
    nome: nomeJogador,
    pontos: pontos,
    acertos: acertos,
    erros: erros
  });

  ranking.sort((a, b) => b.pontos - a.pontos);
  ranking = ranking.slice(0, 20);

  localStorage.setItem("rankingBiblico", JSON.stringify(ranking));

  let tabelaFinal = document.getElementById("rankingTabela");
  if (tabelaFinal) {
    tabelaFinal.innerHTML = "";

    ranking.forEach((item, index) => {
      tabelaFinal.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.nome}</td>
          <td>${item.pontos}</td>
        </tr>
      `;
    });
  }
}

function finalizarJogo() {
  let tempoFinal = Math.floor((Date.now() - tempoInicio) / 1000);
  let estrelas = calcularEstrelas();

  document.getElementById("jogo").style.display = "none";
  document.getElementById("overlay-acerto").style.display = "none";
  document.getElementById("overlay-erro").style.display = "none";
  document.getElementById("resultado").style.display = "flex";

  document.getElementById("finalPontos").innerText = pontos;
  document.getElementById("finalAcertos").innerText = acertos;
  document.getElementById("finalErros").innerText = erros;
  document.getElementById("finalTempo").innerText = formatarTempo(tempoFinal);
  document.getElementById("finalEstrelas").innerText = "⭐".repeat(estrelas);
  document.getElementById("finalRank").innerText = calcularRank();

  if (!pontuacaoSalvaNestaPartida) {
  let pontosAcumulados = Number(localStorage.getItem("pontosAcumuladosBiblico")) || 0;
  pontosAcumulados += pontos;

  localStorage.setItem("pontosAcumuladosBiblico", pontosAcumulados);
  document.getElementById("pontosTotal").innerText = pontosAcumulados;

  pontuacaoSalvaNestaPartida = true;
}

  atualizarRankingFinal();
}

function mostrarFinalBiblico() {
  document.getElementById("resultado").style.display = "none";
  document.getElementById("final-biblico").style.display = "flex";
}

function atualizarPlacar() {
  let pontosAcumulados = Number(localStorage.getItem("pontosAcumuladosBiblico")) || 0;

  document.getElementById("pontos").innerText = pontos;
  document.getElementById("pontosTotal").innerText = pontosAcumulados + pontos;
  document.getElementById("acertos").innerText = acertos;
  document.getElementById("erros").innerText = erros;
}

function reiniciar() {
  indice = 0;
  pontos = 0;
  acertos = 0;
  erros = 0;
  respondeu = false;
  pontuacaoSalvaNestaPartida = false;
  tempoInicio = Date.now();

  carregarPergunta();
}
window.addEventListener("load", function () {
  let pontosAcumulados = Number(localStorage.getItem("pontosAcumuladosBiblico")) || 0;
  document.getElementById("pontosTotal").innerText = pontosAcumulados;
});
