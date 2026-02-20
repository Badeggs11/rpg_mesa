function aplicarAPRNaNovaRodada(estado) {
  if (!estado.jogadores) return estado;

  if (!estado.logMundo) estado.logMundo = [];

  estado.jogadores.forEach(jogador => {
    if (!jogador.vivo) return;

    // APR base que o jogador ganha a cada rodada (padrão 2)
    if (typeof jogador.aprPorRodada !== 'number') {
      jogador.aprPorRodada = 2;
    }

    // Se nunca teve APR, começa com o valor da rodada
    if (typeof jogador.aprAtual !== 'number') {
      jogador.aprAtual = 0;
    }

    // ✅ ACUMULA (não reseta)
    jogador.aprAtual += jogador.aprPorRodada;

    // Em campanha, "pronto" volta a false quando a rodada começa
    jogador.pronto = false;
  });

  estado.logMundo.push({
    tipo: 'apr_acumulado',
    rodada: estado.rodadaGlobal,
    descricao: 'Os pontos de ação (APR) foram acumulados para a nova rodada.',
  });

  return estado;
}

function consumirAPR(estado, jogadorId, custo = 1) {
  const jogador = estado.jogadores.find(j => j.id === jogadorId);
  if (!jogador || !jogador.vivo) return false;

  if (typeof jogador.aprAtual !== 'number') jogador.aprAtual = 0;

  if (jogador.aprAtual < custo) {
    return false; // sem APR suficiente
  }

  jogador.aprAtual -= custo;

  // Se zerou APR, ele automaticamente fica "pronto"
  if (jogador.aprAtual <= 0) {
    jogador.aprAtual = 0;
    jogador.pronto = true;
  }

  if (!estado.logMundo) estado.logMundo = [];

  estado.logMundo.push({
    tipo: 'apr_consumido',
    rodada: estado.rodadaGlobal,
    jogadorId,
    custo,
    aprRestante: jogador.aprAtual,
    descricao: `Jogador ${jogadorId} utilizou ${custo} APR.`,
  });

  return true;
}

module.exports = {
  aplicarAPRNaNovaRodada,
  consumirAPR,
};
