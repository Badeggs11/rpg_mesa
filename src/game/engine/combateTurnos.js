const { rolarIniciativa } = require('./iniciativa');
const { resolverAtaque } = require('./resolverAtaque');
const { resolverDefesa } = require('./resolverDefesa');

function criarEstadoInicial(p1, p2) {
  const iniciativa = rolarIniciativa(p1, p2);

  const primeiro = iniciativa.primeiro;
  const segundo = primeiro.nome === p1.nome ? p2 : p1;

  return {
    turno: 1,
    atacanteAtual: primeiro.nome,
    defensorAtual: segundo.nome,
    personagens: {
      [p1.nome]: { ...p1 },
      [p2.nome]: { ...p2 },
    },
    fase: 'aguardandoAtaque',
    ataquePendente: null,

    log: [
      {
        tipo: 'iniciativa',
        iniciativa,
        primeiro: primeiro.nome,
      },
    ],
    finalizado: false,
  };
}

function executarTurno(estado, payload) {
  if (estado.finalizado) {
    throw new Error('Combate ja finalizado');
  }
  switch (estado.fase) {
    case 'aguardandoAtaque':
      return executarFaseAtaque(estado, payload);
    case 'aguardandoDefesa':
      return executarFaseDefesa(estado, payload);
    default:
      throw new Error(`Fase invalida: ${estado.fase}`);
  }
}
function executarFaseAtaque(estado, payload) {
  const { acao } = payload;

  if (acao !== 'ataqueFisico' && acao !== 'ataqueMagico') {
    throw new Error('acao de ataque invalida');
  }
  const atacante = estado.personagens[estado.atacanteAtual];

  const resultadoAtaque = resolverAtaque(atacante, acao);

  estado.ataquePendente = resultadoAtaque;

  estado.log.push({
    tipo: 'ataque',
    atacante: atacante.nome,
    acao,
    ataque: resultadoAtaque,
  });
  estado.fase = 'aguardandoDefesa';
}
function executarFaseDefesa(estado, payload) {
  const { defesaEscolhida } = payload;

  if (!defesaEscolhida) {
    throw new Error('Defesa não informada');
  }
  const defensor = estado.personagens[estado.defensorAtual];

  const resultadoDefesa = resolverDefesa(defensor, defesaEscolhida);

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
