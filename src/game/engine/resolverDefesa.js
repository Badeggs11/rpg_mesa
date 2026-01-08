const { jogarDado } = require('../dice');

function resolverDefesa(regraDefesa, regraAtaque, rolagemDefesa) {
  // 1️⃣ rolagem principal da defesa

  // 2️⃣ valor bruto de defesa
  const valorDefesa = rolagemDefesa + regraDefesa.intensidade;

  // 3️⃣ checar se reagiu a tempo (velocidade)
  const reagiu = regraDefesa.velocidade >= regraAtaque.velocidade;

  // 4️⃣ checar direção
  const direcaoCorreta = regraDefesa.direcao === regraAtaque.direcao;

  // 5️⃣ esquiva pura (velocidade + direção)
  const ehEsquiva = regraDefesa.estilo === 'esquiva';

  const evadiu = ehEsquiva && reagiu && direcaoCorreta;

  // 6️⃣ bloqueio parcial ou total
  const ehBloqueio = regraDefesa.estilo === 'bloqueio';

  const neutralizouGolpe =
    ehBloqueio && direcaoCorreta && valorDefesa >= regraAtaque.intensidade;

  return {
    tipo: 'resultadoDefesa',
    estilo: regraDefesa.estilo,

    rolagem: rolagemDefesa,
    valorDefesa,

    reagiu,
    direcao: regraDefesa.direcao,
    direcaoCorreta,

    evadiu,
    neutralizouGolpe,
  };
}

module.exports = { resolverDefesa };
