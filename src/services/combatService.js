const personagensService = require('./personagensService');
const { obterCombate, removerCombate } = require('./combatStore');
const { executarTurno } = require('../game/engine/combateTurnos');

const { v4: uuid } = require('uuid');
const { criarCombate } = require('./combatStore');
const { criarEstadoInicial } = require('../game/engine/combateTurnos');

const decidirAcaoCpu = require('../game/engine/ia/decidirAcaoCpu');

async function executarAcao(combateId, payload) {
  const combate = obterCombate(combateId);
  if (!combate) {
    throw new Error('Combate nao encontrado');
  }
  if (combate.finalizado) {
    throw new Error('Combate ja finalizado');
  }

  // 🔹 1) Executa ação recebida (humano ou vazio)
  executarTurno(combate, payload);

  function obterPersonagemDaVez(combate) {
    const fase = combate.fase;

    if (fase === 'aguardandoAtaque' || fase === 'aguardandoRolagemAtaque') {
      return combate.personagens[combate.atacanteAtual];
    }

    if (fase === 'aguardandoDefesa' || fase === 'aguardandoRolagemDefesa') {
      return combate.personagens[combate.defensorAtual];
    }

    if (fase === 'avaliandoIniciativaExtra') {
      return combate.personagens[combate.atacanteAtual];
    }

    return null;
  }

  function faseExigeAnimacao(fase) {
    return (
      fase === 'aguardandoRolagemIniciativa' ||
      fase === 'aguardandoRolagemAtaque' ||
      fase === 'aguardandoRolagemDefesa'
    );
  }

  while (!combate.finalizado) {
    const personagemDaVez = obterPersonagemDaVez(combate);

    if (!personagemDaVez || personagemDaVez.controlador !== 'cpu') break;

    // 🚨 SE A PRÓXIMA FASE É UMA ROLAGEM VISUAL, PARA AQUI
    if (faseExigeAnimacao(combate.fase)) break;

    const acaoCpu = decidirAcaoCpu(combate);
    executarTurno(combate, acaoCpu);
  }

  // 🔹 3) Se acabou o combate

  if (combate.finalizado) {
    removerCombate(combateId);
  }
  return combate;
}

async function iniciarCombate({
  atacanteId,
  defensorId,
  controladorA = 'humano',
  controladorB = 'humano',
}) {
  const atacante = await personagensService.buscarPorId(atacanteId);
  const defensor = await personagensService.buscarPorId(defensorId);

  atacante.controlador = controladorA;
  defensor.controlador = controladorB;

  if (!atacante || !defensor) {
    throw new Error('Personagem não encontrado');
  }

  console.log('Atacante vindo do service:', atacante);
  console.log('Defensor vindo do service:', defensor);

  const estado = criarEstadoInicial(atacante, defensor);

  const combate = {
    id: uuid(),
    ...estado,
  };
  criarCombate(combate);
  // 🟢 Dispara a primeira fase (rolagem de iniciativa)
  executarTurno(combate, {});

  // 🔥 Se o primeiro a jogar for CPU, inicia automaticamente
  while (!combate.finalizado) {
    const personagemAtual = combate.personagens[combate.atacanteAtual];

    if (!personagemAtual || personagemAtual.controlador !== 'cpu') break;

    const acaoCpu = decidirAcaoCpu(combate);
    executarTurno(combate, acaoCpu);
  }

  return combate;
}

module.exports = {
  iniciarCombate,
  executarAcao,
};
