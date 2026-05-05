const { mapaBase } = require('../../../world/mapas/mapaBase');

function moverJogadorNoMapa(estadoCampanha, jogadorId, destinoOuDirecao) {
  if (!estadoCampanha) {
    throw new Error('Estado de campanha inválido');
  }

  if (!jogadorId) {
    throw new Error('jogadorId é obrigatório');
  }

  // if (!destino) {
  // throw new Error('Destino é obrigatório');
  //}

  if (!estadoCampanha.posicaoJogadores) {
    estadoCampanha.posicaoJogadores = {};
  }

  if (!estadoCampanha.exploracao) {
    estadoCampanha.exploracao = {};
  }

  if (!estadoCampanha.exploracao[jogadorId]) {
    // 🧭 NOVO SISTEMA: movimento por DIREÇÃO (grid)
    const direcoes = ['cima', 'baixo', 'esquerda', 'direita'];

    if (direcoes.includes(destinoOuDirecao)) {
      const jogador = estadoCampanha.jogadores.find(j => j.id === jogadorId);

      if (!jogador.posicao) {
        jogador.posicao = { x: 0, y: 0 };
      }

      switch (destinoOuDirecao) {
        case 'cima':
          jogador.posicao.y -= 1;
          break;
        case 'baixo':
          jogador.posicao.y += 1;
          break;
        case 'esquerda':
          jogador.posicao.x -= 1;
          break;
        case 'direita':
          jogador.posicao.x += 1;
          break;
      }

      if (!estadoCampanha.logMundo) {
        estadoCampanha.logMundo = [];
      }

      estadoCampanha.logMundo.push({
        tipo: 'movimento_grid',
        rodada: estadoCampanha.rodadaGlobal,
        jogadorId,
        posicao: jogador.posicao,
        descricao: `${jogadorId} moveu para (${jogador.posicao.x}, ${jogador.posicao.y})`,
      });

      console.log(
        `🧭 [GRID] ${jogador.nome} → (${jogador.posicao.x}, ${jogador.posicao.y})`
      );

      return estadoCampanha;
    }

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

  if (!conexoes.includes(destinoOuDirecao)) {
    throw new Error(
      `Movimento inválido: ${localAtual} não possui conexão com ${destinoOuDirecao}`
    );
  }

  estadoCampanha.mapa.posicaoJogadores[jogadorId] = {
    localAtual: destinoOuDirecao,
    pos: mapaBase[destinoOuDirecao].pos,
  };

  if (!exploracaoJogador.locaisVisitados.includes(destinoOuDirecao)) {
    exploracaoJogador.locaisVisitados.push(destinoOuDirecao);
  }

  if (!exploracaoJogador.locaisDescobertos.includes(destinoOuDirecao)) {
    exploracaoJogador.locaisDescobertos.push(destinoOuDirecao);
  }

  const novasConexoes = mapaBase[destinoOuDirecao].conexoes || [];

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
    destino: destinoOuDirecao,
    descricao: `${jogadorId} se moveu de ${localAtual} para ${destinoOuDirecao}`,
  });

  return estadoCampanha;
}

module.exports = moverJogadorNoMapa;
