const { narrativePackBase } = require('./narrativePackBase');

function gerarNarrativa(estadoCampanha) {
  const ultimaAcao = estadoCampanha?.historicoAcoes?.slice(-1)[0] || {};
  const jogadorNome = ultimaAcao?.jogadorNome || 'O aventureiro';
  const acao = ultimaAcao?.acao || '';

  let narrativaAcao = '';

  switch (acao) {
    case 'explorar':
      narrativaAcao = `${jogadorNome} ${pick(narrativePackBase.exploracao)}`;
      break;

    case 'investigar':
      narrativaAcao = `${jogadorNome} ${pick(narrativePackBase.investigacao)}`;
      break;

    case 'observar':
      narrativaAcao = `${jogadorNome} ${pick(narrativePackBase.observacao)}`;
      break;

    case 'descansar':
      narrativaAcao = `${jogadorNome} ${pick(narrativePackBase.descanso)}`;
      break;
  }

  const tensao = estadoCampanha?.reacaoMundo?.nivelTensaoGlobal ?? 0;

  let ambiente;

  if (tensao < 3) ambiente = pick(narrativePackBase.ambiente.tensao_baixa);
  else if (tensao < 7) ambiente = pick(narrativePackBase.ambiente.tensao_media);
  else ambiente = pick(narrativePackBase.ambiente.tensao_alta);

  const descoberta = pick(narrativePackBase.descoberta.nenhuma);

  const narrativaFinal = `
  
${ambiente}

${narrativaAcao}

${descoberta}
`.trim();

  return {
    narracao: narrativaFinal,
    rodada: estadoCampanha.rodadaGlobal,
  };
}

function pick(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

module.exports = { gerarNarrativa };
