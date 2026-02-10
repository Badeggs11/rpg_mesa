const { jogarDado } = require('../dice');

function resolverAtaque(regraAtaque, rolagemAtaque) {
  // 1️⃣ rolagem do ataque

  // 2️⃣ valor base do ataque
  let valorAtaque = rolagemAtaque + regraAtaque.intensidade;

  return {
    tipo: 'resultadoAtaque',
    estilo: regraAtaque.estilo,

    rolagem: rolagemAtaque,
    valorAtaque,
  };
}

module.exports = { resolverAtaque };
