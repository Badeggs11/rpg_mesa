const resolverRodadaCampanha = require('../game/engine/campanha/resolverRodadaCampanha');
const finalizarTurnoJogador = require('../game/engine/campanha/finalizarTurnoJogador');
const moverJogadorNoMapa = require('../game/engine/campanha/movimento/sistemaMovimentoMapa');

const combatService = require('./combatService');
const {
  obterInimigoFallback,
} = require('../game/world/tabelas/tabelaInimigosPorEncontro');

async function processarRodada(estadoCampanha) {
  if (!estadoCampanha) {
    throw new Error('Estado de campanha inválido');
  }

  // 🧱 Blindagem estrutural (sandbox seguro)
  if (typeof estadoCampanha.rodadaGlobal !== 'number') {
    estadoCampanha.rodadaGlobal = 0;
  }

  if (!estadoCampanha.logMundo) {
    estadoCampanha.logMundo = [];
  }

  estadoCampanha.logMundo.push({
    tipo: 'tempo_avancou',
    rodada: estadoCampanha.rodadaGlobal,
    descricao: `O tempo do mundo avançou para a rodada ${estadoCampanha.rodadaGlobal}.`,
  });

  // 🔄 encerra turno do jogador atual
  finalizarTurnoJogador(estadoCampanha);

  const todosProntos = estadoCampanha.jogadores.every(j => j.pronto);

  if (todosProntos) {
    estadoCampanha.rodadaGlobal += 1;

    estadoCampanha.logMundo.push({
      tipo: 'rodada_avancada',
      rodada: estadoCampanha.rodadaGlobal,
      descricao: `A rodada ${estadoCampanha.rodadaGlobal} começou.`,
    });

    // roda o mundo apenas quando a rodada completa termina
    if (estadoCampanha.todosJogadoresProntos) {
      resolverRodadaCampanha(estadoCampanha);
    }
  }

  // ⚔️ 2. Verifica gatilho sistêmico de combate

  if (
    estadoCampanha.gatilhoCombate &&
    estadoCampanha.gatilhoCombate.status === 'pendente'
  ) {
    const jogadorId = estadoCampanha.ciclo?.jogadorDaVez;

    if (!jogadorId) {
      throw new Error('Jogador da vez não definido na campanha');
    }

    // 🎯 Seleção híbrida do inimigo baseada no encontro do mundo
    const tipoEncontro = estadoCampanha.gatilhoCombate.tipoEncontro;
    const perigo = estadoCampanha.gatilhoCombate.perigo;

    // 🧬 Mundo decide qual inimigo representa esse perigo
    const defensorId = obterInimigoFallback(tipoEncontro, perigo);

    // 🎮 Inicia combate sistêmico
    const combate = await combatService.iniciarCombate({
      atacanteId: jogadorId,
      defensorId,
      controladorA: 'humano',
      controladorB: 'cpu',
    });

    // 🏷️ Atualiza gatilho como consumido
    estadoCampanha.gatilhoCombate.status = 'consumido';
    estadoCampanha.gatilhoCombate.combateId = combate.id;

    estadoCampanha.logMundo.push({
      tipo: 'combate_iniciado_pela_campanha',
      rodada: estadoCampanha.rodadaGlobal,
      combateId: combate.id,
      origem: 'gatilho_sistemico',
      descricao:
        'Um combate foi iniciado automaticamente a partir de um encontro perigoso do mundo.',
    });

    // ✅ Avança o turno do jogador (tabuleiro)
    finalizarTurnoJogador(estadoCampanha);

    return {
      estadoCampanha,
      combate,
      combateIniciado: true,
    };
  }

  return {
    estadoCampanha,
    combate: null,
    combateIniciado: false,
  };
}

function moverJogadorMapa(estadoCampanha, jogadorId, destino) {
  if (!estadoCampanha) {
    throw new Error('Estado de campanha inválido');
  }

  if (!jogadorId) {
    throw new Error('jogadorId é obrigatório');
  }

  if (!destino) {
    throw new Error('Destino é obrigatório');
  }

  // chama a engine
  moverJogadorNoMapa(estadoCampanha, jogadorId, destino);

  return estadoCampanha;
}

module.exports = {
  processarRodada,
  moverJogadorMapa,
};
