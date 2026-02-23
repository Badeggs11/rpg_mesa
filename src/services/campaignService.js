const resolverRodadaCampanha = require('../game/engine/campanha/resolverRodadaCampanha');
const combatService = require('./combatService');
const {
  obterInimigoFallback,
} = require('../game/world/tabelas/tabelaInimigosPorEncontro');

async function processarRodada(estadoCampanha) {
  if (!estadoCampanha) {
    throw new Error('Estado de campanha inválido');
  }

  // 🧠 1. Processa o mundo (engine pura)
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

    // 🎮 Inicia combate usando personagem do banco (simples e testável)
    // 🎯 Seleção híbrida do inimigo baseada no encontro do mundo
    const tipoEncontro = estadoCampanha.gatilhoCombate.tipoEncontro;
    const perigo = estadoCampanha.gatilhoCombate.perigo;

    // 🧬 Mundo decide qual inimigo representa esse perigo
    const defensorId = obterInimigoFallback(tipoEncontro, perigo);

    // 🎮 Inicia combate sistêmico (não mais fixo)
    const combate = await combatService.iniciarCombate({
      atacanteId: jogadorId,
      defensorId,
      controladorA: 'humano',
      controladorB: 'cpu',
    });

    // 🏷️ Atualiza gatilho como consumido (histórico sistêmico)
    estadoCampanha.gatilhoCombate.status = 'consumido';
    estadoCampanha.gatilhoCombate.combateId = combate.id;

    if (!estadoCampanha.logMundo) {
      estadoCampanha.logMundo = [];
    }

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
