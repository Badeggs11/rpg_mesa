const personagensService = require('./personagensService');
const { obterCombate, removerCombate } = require('./combatStore');
const { executarTurno } = require('../game/engine/combateTurnos');

const { v4: uuid } = require('uuid');
const { criarCombate } = require('./combatStore');
const { criarEstadoInicial } = require('../game/engine/combateTurnos');

async function executarAcao(combateId, payload) {
  const combate = obterCombate(combateId);
  if (!combate) {
    throw new Error('Combate nao encontrado');
  }
  if (combate.finalizado) {
    throw new Error('Combate ja finalizado');
  }

  executarTurno(combate, payload);

  if (combate.finalizado) {
    removerCombate(combateId);
  }
  return combate;
}

async function iniciarCombate({ atacanteId, defensorId }) {
  const atacante = await personagensService.buscarPorId(atacanteId);
  const defensor = await personagensService.buscarPorId(defensorId);

  if (!atacante || !defensor) {
    throw new Error('Personagem não encontrado');
  }
  const estado = criarEstadoInicial(atacante, defensor);

  const combate = {
    id: uuid(),
    ...estado,
  };
  criarCombate(combate);
  return combate;
}

module.exports = {
  iniciarCombate,
  executarAcao,
};
