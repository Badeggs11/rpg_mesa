const { rolarIniciativa } = require('./iniciativa');
const { resolverAtaque } = require('./resolverAtaque');
const { resolverDefesa } = require('./resolverDefesa');
const rules = require('../rules');
const espadas = require('../world/armas/espadas');

function criarEstadoInicial(p1, p2) {
  return {
    turno: 0,
    atacanteAtual: null,
    defensorAtual: null,

    personagens: {
      [p1.nome]: { ...p1 },
      [p2.nome]: { ...p2 },
    },

    fase: 'aguardandoIniciativa',

    ataquePendente: null,

    log: [],

    finalizado: false,
  };
}

function executarTurno(estado, payload) {
  if (estado.finalizado) {
    throw new Error('Combate ja finalizado');
  }
  switch (estado.fase) {
    case 'aguardandoIniciativa':
      return executarFaseIniciativa(estado, payload);
    case 'aguardandoAtaque':
      return executarFaseAtaque(estado, payload);
    case 'aguardandoDefesa':
      return executarFaseDefesa(estado, payload);
    default:
      throw new Error(`Fase invalida: ${estado.fase}`);
  }
}
function executarFaseIniciativa(estado) {
  const nomes = Object.keys(estado.personagens);
  const p1 = estado.personagens[nomes[0]];
  const p2 = estado.personagens[nomes[1]];

  const iniciativa = rolarIniciativa(p1, p2);

  estado.atacanteAtual = iniciativa.primeiro.nome;
  estado.defensorAtual =
    iniciativa.primeiro.nome === p1.nome ? p2.nome : p1.nome;

  estado.turno = 1;
  estado.fase = 'aguardandoAtaque';

  estado.log.push({
    tipo: 'iniciativa',
    iniciativa,
    primeiro: iniciativa.primeiro.nome,
  });
}

function executarFaseAtaque(estado, payload) {
  const { acao } = payload;

  if (acao !== 'ataqueFisico' && acao !== 'ataqueMagico') {
    throw new Error('acao de ataque invalida');
  }
  const atacante = estado.personagens[estado.atacanteAtual];
  let regraAtaque;

  if (acao === 'ataqueFisico') {
    const arma = espadas.curta;
    regraAtaque = rules.ataqueFisico(atacante, arma);
  }
  if (acao === 'ataqueMagico') {
    throw new Error('Ataque mágico ainda nao implementado');
  }

  const resultadoAtaque = resolverAtaque(regraAtaque);

  estado.ataquePendente = resultadoAtaque;

  estado.log.push({
    tipo: 'ataque',
    atacante: atacante.nome,
    acao,
    regra: regraAtaque,
    ataque: resultadoAtaque,
  });
  estado.fase = 'aguardandoDefesa';
}
function executarFaseDefesa(estado, payload) {
  const { defesaEscolhida } = payload;

  if (!defesaEscolhida) {
    throw new Error('Defesa não informada');
  }

  if (!estado.ataquePendente) {
    throw new Error('Nenhum ataque pendente para defender');
  }
  const defensor = estado.personagens[estado.defensorAtual];

  let regraDefesa;

  switch (defesaEscolhida) {
    case 'defesaFisica':
      regraDefesa = rules.defesaFisica(defensor);
      break;

    case 'defesaMagica':
      regraDefesa = rules.defesaMagica(defensor);
      break;

    case 'esquiva':
      regraDefesa = rules.esquiva(defensor);
      break;

    case 'fuga':
      regraDefesa = rules.fugir(defensor);
      break;

    default:
      throw new Error('Defesa invalida');
  }

  const resultadoDefesa = resolverDefesa(regraDefesa);

  const ataque = estado.ataquePendente;

  const dano = Math.max(0, ataque.valorAtaque - resultadoDefesa.valorDefesa);

  defensor.pontosDeVida -= dano;

  estado.log.push({
    tipo: 'defesa',
    defensor: defensor.nome,
    defesa: resultadoDefesa,
    dano,
    vidaRestante: defensor.pontosDeVida,
  });
  estado.ataquePendente = null;

  if (defensor.pontosDeVida <= 0) {
    estado.finalizado = true;
    estado.fase = 'finalizado';

    estado.log.push({
      tipo: 'fimCombate',
      vencedor: estado.atacanteAtual,
      derrotado: estado.defensorAtual,
    });
    return;
  }
  [estado.atacanteAtual, estado.defensorAtual] = [
    estado.defensorAtual,
    estado.atacanteAtual,
  ];
  estado.turno += 1;
  estado.fase = 'aguardandoAtaque';
}

module.exports = {
  criarEstadoInicial,
  executarTurno,
};
