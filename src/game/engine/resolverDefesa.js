const { jogarDado } = require('../dice');

function resolverDefesa(defensor, defesaEscolhida) {
  let bonus = 0;

  if (defesaEscolhida === 'defesaFisica') {
    bonus = (defensor.resistencia || 0) + (defensor.forca || 0);
  }
  if (defesaEscolhida === 'defesaMagica') {
    bonus = (defensor.inteligencia || 0) + (defensor.resistencia || 0);
  }
  if (defesaEscolhida === 'esquiva') {
    bonus = (defensor.agilidade || 0) + (defensor.inteligencia || 0);
  }
  const rolagem = jogarDado(20);
  const valorDefesa = rolagem + bonus;

  return {
    tipo: 'resultadoDefesa',
    estilo: defesaEscolhida,
    rolagem,
    bonus,
    valorDefesa,
  };
}

module.exports = { resolverDefesa };
