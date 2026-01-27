// backend/engine/ia/decidirAcaoCpu.js

function escolherAleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function decidirAcaoCpu(estado) {
  const fase = estado.fase;

  // Fases que só precisam rolar dado
  if (fase.startsWith('aguardandoRolagem')) {
    return {}; // equivalente ao botão 🎲
  }

  const golpesAtaqueWorld = require('../../world/golpesAtaque');
  const golpesDefesaWorld = require('../../world/golpesDefesa');

  const golpesAtaque = Object.keys(golpesAtaqueWorld);
  const golpesDefesa = Object.keys(golpesDefesaWorld);

  const alturas = ['alto', 'baixo'];
  const lados = ['esquerda', 'direita', 'frontal'];

  const direcao = `${escolherAleatorio(alturas)}-${escolherAleatorio(lados)}`;

  if (fase === 'aguardandoAtaque') {
    return {
      golpe: escolherAleatorio(golpesAtaque),
      direcao,
    };
  }

  if (fase === 'aguardandoDefesa') {
    return {
      golpe: escolherAleatorio(golpesDefesa),
      direcao,
    };
  }

  return {};
}

module.exports = decidirAcaoCpu;
