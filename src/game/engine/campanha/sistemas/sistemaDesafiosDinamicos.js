// 🎯 sistemaDesafiosDinamicos.js
// Gera oportunidades emergentes baseadas na tensão do mundo.
// NÃO força missões. NÃO altera atributos. NÃO usa DB.
// Apenas semeia desafios opcionais no mundo.

function inicializarEstruturasDesafio(estado) {
  if (!estado.eventosDisparados) {
    estado.eventosDisparados = [];
  }

  if (estado.eventoDramaticoAtivo === undefined) {
    estado.eventoDramaticoAtivo = null;
  }
}

function gerarIdEvento(prefixo, rodada) {
  return `${prefixo}_${rodada}`;
}

function escolherDesafioPorTensao(nivelTensao) {
  // Mundo calmo → descobertas leves
  if (nivelTensao <= 1) {
    return {
      tipo: 'desafio_exploracao',
      subtipo: 'ermitão',
      descricao:
        'Um ermitão solitário foi avistado em uma região isolada do mundo.',
    };
  }

  // Mundo inquieto → provas e enigmas
  if (nivelTensao <= 3) {
    return {
      tipo: 'desafio_prova',
      subtipo: 'charada_antiga',
      descricao:
        'Sussurros sobre um antigo desafio intelectual começaram a circular.',
    };
  }

  // Mundo tenso → desafios de sobrevivência
  if (nivelTensao <= 6) {
    return {
      tipo: 'desafio_sobrevivencia',
      subtipo: 'ambiente_hostil',
      descricao:
        'As condições do mundo se tornaram mais severas, exigindo adaptação dos aventureiros.',
    };
  }

  // Mundo crítico → desafios perigosos
  return {
    tipo: 'desafio_perigoso',
    subtipo: 'forca_do_mundo',
    descricao:
      'Forças desconhecidas do mundo começaram a testar os limites dos viajantes.',
  };
}

function jaExisteEventoNaRodada(estado, rodada) {
  return estado.eventosDisparados.some(e => e.rodada === rodada);
}

function sistemaDesafiosDinamicos(estado) {
  if (!estado) return estado;
  if (!estado.reacaoMundo) return estado; // depende da reação do mundo

  inicializarEstruturasDesafio(estado);

  const rodada = estado.rodadaGlobal;
  const nivelTensao = estado.reacaoMundo.nivelTensaoGlobal || 0;

  // Evita spam de eventos na mesma rodada
  if (jaExisteEventoNaRodada(estado, rodada)) {
    return estado;
  }

  // Probabilidade emergente baseada na tensão (quanto maior, mais provável)
  const chanceBase = 0.2 + nivelTensao * 0.1;
  const rolagem = Math.random();

  if (rolagem > chanceBase) {
    return estado; // mundo nem sempre oferece desafios
  }

  const desafio = escolherDesafioPorTensao(nivelTensao);
  const eventoId = gerarIdEvento(desafio.tipo, rodada);

  const evento = {
    id: eventoId,
    tipo: 'evento_dinamico',
    categoria: 'desafio',
    rodada,
    desafio: desafio.tipo,
    subtipo: desafio.subtipo,
    descricao: desafio.descricao,
    opcional: true, // IMPORTANTÍSSIMO para sua filosofia
    origem: 'mundo_sistemico',
  };

  estado.eventosDisparados.push(evento);
  estado.eventoDramaticoAtivo = evento;

  if (!estado.logMundo) {
    estado.logMundo = [];
  }

  // HUD leve + narrativa sutil (sem impor missão)
  estado.logMundo.push({
    tipo: 'oportunidade_mundo',
    rodada,
    eventoId: eventoId, // 🔥 adicione isso
    descricao:
      'Uma nova oportunidade surgiu no mundo. Cabe aos aventureiros decidir se irão se envolver.',
  });

  return estado;
}

module.exports = sistemaDesafiosDinamicos;
