// game/engine/resolverAtaque.js
const { jogarDado } = require('../dice');

function resolverAtaque(regraAtaque) {
  if (!regraAtaque || regraAtaque.tipo !== 'ataque') {
    throw new Error('Regra de ataque invalida');
  }
  const { ataque, dano, estilo, descricao } = regraAtaque;
  const rolagem = jogarDado(ataque.dado);
  const bonusBase = ataque.base || 0;
  const bonusParametros = Object.values(ataque.parametros || {}).reduce(
    (soma, valor) => soma + (valor || 0),
    0
  );

  const bonusEfetivoBase = aplicarBonusPercentual(bonusBase);
  const bonusEfetivoParametros = aplicarBonusPercentual(bonusParametros);
  const bonusEfetivoTotal = bonusEfetivoBase + bonusEfetivoParametros;

  const valorAtaque = rolagem + bonusEfetivoTotal;

  return {
    tipo: 'resultadoAtaque',
    estilo,
    descricao,

    dado: ataque.dado,
    rolagem,

    bonus: {
      base: bonusBase,
      parametros: bonusParametros,
      efetivoBase: bonusEfetivoBase,
      efetivoParametros: bonusEfetivoParametros,
      efetivoTotal: bonusEfetivoTotal,
    },

    valorAtaque,

    dano: {
      dado: dano.dado,
    },
  };
}
function aplicarBonusPercentual(valor, percentual = 0.1) {
  return Math.floor(valor * percentual);
}
module.exports = {
  resolverAtaque,
};
