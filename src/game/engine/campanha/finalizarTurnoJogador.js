const resolverRodadaCampanha = require('./resolverRodadaCampanha');
const {
  tempoRodadaEsgotado,
  iniciarTempoRodada,
} = require('./sistemas/sistemaTempoRodada');

function finalizarTurnoJogador(estado) {
  const ciclo = estado.ciclo;

  // jogador atual
  const jogadorAtualId = ciclo.jogadorDaVez;

  // ⏳ VERIFICA SE O TEMPO DA RODADA ESGOTOU
  if (tempoRodadaEsgotado(estado)) {
    // força todos os jogadores como prontos
    estado.jogadores.forEach(j => {
      if (j.vivo) {
        j.pronto = true;
      }
    });

    estado.logMundo.push({
      tipo: 'tempo_rodada_esgotado',
      rodada: estado.rodadaGlobal,
      descricao:
        'O tempo da rodada se esgotou. O mundo avança automaticamente.',
    });

    // força o ciclo a encerrar imediatamente
    ciclo.indiceAtual = ciclo.ordemJogadores.length;
  }

  // marca que ele já jogou na rodada
  const jogador = estado.jogadores.find(j => j.id === jogadorAtualId);

  // avança o índice do turno
  ciclo.indiceAtual++;

  const todosJogadores = ciclo.ordemJogadores;

  // se ainda existem jogadores na rodada
  if (ciclo.indiceAtual < todosJogadores.length) {
    ciclo.jogadorDaVez = todosJogadores[ciclo.indiceAtual];
  } else {
    // 🔥 TODOS JOGARAM → AVANÇA RODADA GLOBAL
    estado.rodadaGlobal += 1;

    // 🌍 PROCESSA A REAÇÃO DO MUNDO (NÚCLEO SANDBOX)
    resolverRodadaCampanha(estado);

    // reinicia ciclo
    ciclo.indiceAtual = 0;
    ciclo.jogadorDaVez = todosJogadores[0];

    // reseta status "pronto" dos jogadores
    estado.jogadores.forEach(j => {
      if (j.vivo) {
        j.pronto = false;
      }
    });

    // log do mundo (igual ao log do combate)
    estado.logMundo.push({
      tipo: 'rodada_global',
      rodada: estado.rodadaGlobal,
      descricao: `O mundo avançou para a rodada ${estado.rodadaGlobal}`,
    });
  }

  return estado;
}

module.exports = finalizarTurnoJogador;
