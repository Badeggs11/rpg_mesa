// sistemaPercepcaoEspacial.js
const { calcularCampoVisao } = require('../percepcao/calcularCampoVisao');

function distancia(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function moverJogadorAleatorio(posicao, passo = 40) {
  const dx = Math.floor(Math.random() * passo * 2 - passo);
  const dy = Math.floor(Math.random() * passo * 2 - passo);

  return {
    x: posicao.x + dx,
    y: posicao.y + dy,
  };
}

function sistemaPercepcaoEspacial(estadoCampanha, jogadorId, mapaBase) {
  const jogador = estadoCampanha.mapa.posicaoJogadores[jogadorId];
  const posJogador = jogador.pos;

  if (!jogador) return;

  // 1️⃣ mover jogador no mapa
  jogador.pos = moverJogadorAleatorio(posJogador);

  const exploracaoJogador = estadoCampanha.exploracao[jogadorId];

  const raioVisao = 120;

  const campoVisao = calcularCampoVisao(jogador.pos, 5);

  console.log('👁 Campo de visão calculado:', campoVisao.length);

  const locaisDescobertos = exploracaoJogador.locaisDescobertos;

  Object.values(mapaBase).forEach(local => {
    const dist = distancia(jogador.pos, local.pos);

    if (dist <= raioVisao) {
      if (!locaisDescobertos.includes(local.id)) {
        locaisDescobertos.push(local.id);

        estadoCampanha.logMundo.push({
          rodada: estadoCampanha.rodadaGlobal,
          descricao: `Novo local descoberto: ${local.nome}`,
        });
      }
    }
  });
}

module.exports = sistemaPercepcaoEspacial;
