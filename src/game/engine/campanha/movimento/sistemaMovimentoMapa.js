const { mapaBase } = require('../../../world/mapas/mapaBase');

function moverJogadorNoMapa(estadoCampanha, jogadorId, destino) {
  if (!estadoCampanha) {
    throw new Error('Estado de campanha inválido');
  }

  if (!jogadorId) {
    throw new Error('jogadorId é obrigatório');
  }

  if (!destino) {
    throw new Error('Destino é obrigatório');
  }

  if (!mapaBase[destino]) {
    throw new Error(`Destino inexistente no mapa: ${destino}`);
  }

  if (!estadoCampanha.posicaoJogadores) {
    estadoCampanha.posicaoJogadores = {};
  }

  if (!estadoCampanha.exploracao) {
    estadoCampanha.exploracao = {};
  }

  if (!estadoCampanha.exploracao[jogadorId]) {
    estadoCampanha.exploracao[jogadorId] = {
      locaisDescobertos: [],
      locaisVisitados: [],
      nevoaDeGuerraAtiva: true,
    };
  }

  const exploracaoJogador = estadoCampanha.exploracao[jogadorId];

  const localAtual =
    estadoCampanha.posicaoJogadores[jogadorId] ||
    estadoCampanha.mapa?.localAtual ||
    null;

  if (!localAtual) {
    throw new Error(`Jogador ${jogadorId} não possui local atual definido`);
  }

  if (!mapaBase[localAtual]) {
    throw new Error(`Local atual inválido no mapa: ${localAtual}`);
  }

  const conexoes = mapaBase[localAtual].conexoes || [];

  if (!conexoes.includes(destino)) {
    throw new Error(
      `Movimento inválido: ${localAtual} não possui conexão com ${destino}`
    );
  }

  estadoCampanha.posicaoJogadores[jogadorId] = destino;

  if (!exploracaoJogador.locaisVisitados.includes(destino)) {
    exploracaoJogador.locaisVisitados.push(destino);
  }

  if (!exploracaoJogador.locaisDescobertos.includes(destino)) {
    exploracaoJogador.locaisDescobertos.push(destino);
  }

  const novasConexoes = mapaBase[destino].conexoes || [];

  novasConexoes.forEach(localConectado => {
    if (!exploracaoJogador.locaisDescobertos.includes(localConectado)) {
      exploracaoJogador.locaisDescobertos.push(localConectado);
    }
  });

  if (!estadoCampanha.logMundo) {
    estadoCampanha.logMundo = [];
  }

  estadoCampanha.logMundo.push({
    tipo: 'movimento_jogador',
    rodada: estadoCampanha.rodadaGlobal,
    jogadorId,
    origem: localAtual,
    destino,
    descricao: `${jogadorId} se moveu de ${localAtual} para ${destino}`,
  });

  return estadoCampanha;
}

module.exports = moverJogadorNoMapa;
