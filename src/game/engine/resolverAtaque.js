const { jogarDado } = require('../dice');

function resolverAtaque(regraAtaque, resultadoDefesa, rolagemAtaque) {
  // 1️⃣ rolagem do ataque

  // 2️⃣ valor base do ataque
  let valorAtaque = rolagemAtaque + regraAtaque.intensidade;

  // 3️⃣ penalidade se defesa reagiu
  if (resultadoDefesa.reagiu && !resultadoDefesa.evadiu) {
    valorAtaque -= resultadoDefesa.valorDefesa * 0.3;
  }

  return {
    tipo: 'resultadoAtaque',
    estilo: regraAtaque.estilo,

    rolagem: rolagemAtaque,
    valorAtaque,
  };
}

module.exports = { resolverAtaque };
