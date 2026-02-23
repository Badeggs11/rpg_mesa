// 🌍 sistemaReacaoDoMundo.js
// Responsável por gerar TENSÕES sistêmicas do mundo
// NÃO cria desafios, NÃO altera atributos, NÃO usa banco.
// Apenas observa o estado e reage de forma sutil e narrativa.

function inicializarEstadoReacao(estado) {
  if (!estado.reacaoMundo) {
    estado.reacaoMundo = {
      nivelTensaoGlobal: 0, // escala gradual do mundo
      ultimoClima: 'estavel',
      historicoTensoes: [],
    };
  }
}

function calcularNivelTensao(estado) {
  const reputacao = estado.reputacao?.global;
  const memoria = estado.memoriaMundo;
  const rodada = estado.rodadaGlobal || 0;

  let tensao = 0;

  // 🧠 Pressão natural do tempo (mundo nunca fica estático)
  tensao += Math.floor(rodada / 3);

  // 🌍 Muitas regiões descobertas = mundo mais complexo
  const regioesDescobertas = memoria?.regioesDescobertas?.length || 0;
  if (regioesDescobertas >= 2) {
    tensao += 1;
  }

  // 👁 Suspeita social gera tensão política
  if (reputacao?.suspeita >= 5) {
    tensao += 2;
  }

  // 🎖 Alta fama atrai atenção do mundo
  if (reputacao?.fama >= 5) {
    tensao += 1;
  }

  return tensao;
}

function determinarClimaDoMundo(nivelTensao) {
  if (nivelTensao <= 1) return 'estavel';
  if (nivelTensao <= 3) return 'inquieto';
  if (nivelTensao <= 6) return 'tenso';
  return 'critico';
}

function registrarMudancaDeClima(estado, novoClima) {
  const reacao = estado.reacaoMundo;

  if (reacao.ultimoClima === novoClima) return;

  reacao.ultimoClima = novoClima;

  if (!estado.logMundo) estado.logMundo = [];

  estado.logMundo.push({
    tipo: 'mudanca_clima_mundo',
    rodada: estado.rodadaGlobal,
    clima: novoClima,
    descricao:
      novoClima === 'estavel'
        ? 'O mundo permanece calmo, mas em constante movimento silencioso.'
        : novoClima === 'inquieto'
        ? 'Sinais sutis indicam que o mundo está se tornando mais inquieto.'
        : novoClima === 'tenso'
        ? 'Uma tensão silenciosa se espalha. Algo no mundo está mudando.'
        : 'O mundo entrou em um estado crítico. Pressões externas aumentam.',
  });

  reacao.historicoTensoes.push({
    rodada: estado.rodadaGlobal,
    clima: novoClima,
  });
}

function registrarTensaoGradual(estado, nivelTensao) {
  if (!estado.logMundo) estado.logMundo = [];

  // HUD leve + narrativa sutil (não invasiva)
  if (nivelTensao >= 2 && nivelTensao < 4) {
    estado.logMundo.push({
      tipo: 'tensao_regional',
      rodada: estado.rodadaGlobal,
      descricao:
        'Rumores silenciosos começam a surgir. O mundo parece mais desafiador.',
    });
  }

  if (nivelTensao >= 5) {
    estado.logMundo.push({
      tipo: 'pressao_mundo',
      rodada: estado.rodadaGlobal,
      descricao:
        'A sobrevivência exige mais movimento e adaptação. O mundo pressiona os aventureiros a evoluir.',
    });
  }
}

function sistemaReacaoDoMundo(estado) {
  if (!estado) return estado;

  inicializarEstadoReacao(estado);

  const nivelTensao = calcularNivelTensao(estado);
  const novoClima = determinarClimaDoMundo(nivelTensao);

  estado.reacaoMundo.nivelTensaoGlobal = nivelTensao;

  registrarMudancaDeClima(estado, novoClima);
  registrarTensaoGradual(estado, nivelTensao);

  return estado;
}

module.exports = sistemaReacaoDoMundo;
