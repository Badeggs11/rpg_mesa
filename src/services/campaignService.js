const resolverRodadaCampanha = require('../game/engine/campanha/resolverRodadaCampanha');
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

  // ⏳ 0. AVANÇA O TEMPO DO MUNDO (CRÍTICO PARA SUA ARQUITETURA)
  // O mundo reage à nova rodada, não à antiga
  estadoCampanha.rodadaGlobal += 1;

  estadoCampanha.logMundo.push({
    tipo: 'tempo_avancou',
    rodada: estadoCampanha.rodadaGlobal,
    descricao: `O tempo do mundo avançou para a rodada ${estadoCampanha.rodadaGlobal}.`,
  });

  // 🧠 1. Processa o mundo (engine macro + mestre + narrativa)
  resolverRodadaCampanha(estadoCampanha);

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

module.exports = {
  processarRodada,
};
