// backend/engine/ia/decidirAcaoCpu.js

function escolherAleatorio(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function decidirAcaoCpu(estado) {
  const fase = estado.fase;

  // 1) Fases que só precisam "clicar no dado"
  if (fase.startsWith('aguardandoRolagem')) {
    return {};
  }

  // 2) Durante pré-contagem, não faz nada (espera o front mandar iniciarTempo)
  if (fase === 'preContagemAtaque' || fase === 'preContagemDefesa') {
    return {};
  }

  const golpesAtaqueWorld = require('../../world/golpesAtaque');
  const golpesDefesaWorld = require('../../world/golpesDefesa');

  const golpesAtaque = Object.keys(golpesAtaqueWorld);
  const golpesDefesa = Object.keys(golpesDefesaWorld);

  const alturas = ['alto', 'baixo'];
  const lados = ['esquerda', 'direita', 'frontal'];
  const direcao = `${escolherAleatorio(alturas)}-${escolherAleatorio(lados)}`;

  // 3) ATAQUE: tanto aguardando quanto tempo ativo
  // CPU deve iniciar o tempo de ataque
  if (fase === 'preContagemAtaque') {
    return { iniciarTempoAtaque: true };
  }

  // CPU deve iniciar o tempo de defesa
  if (fase === 'preContagemDefesa') {
    return { iniciarTempoDefesa: true };
  }

  if (fase === 'aguardandoAtaque' || fase === 'tempoDeAtaque') {
    return {
      golpe: escolherAleatorio(golpesAtaque),
      direcao,
    };
  }

  // 4) DEFESA: tanto aguardando quanto tempo ativo
  if (fase === 'aguardandoDefesa' || fase === 'tempoDeDefesa') {
    return {
      golpe: escolherAleatorio(golpesDefesa),
      direcao,
    };
  }

  return {};
}

module.exports = decidirAcaoCpu;
