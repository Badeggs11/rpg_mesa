function sistemaMestreCampanha(estado) {
  if (!estado) return estado;

  const rodada = estado.rodadaGlobal ?? 0;
  const tensao = estado?.reacaoMundo?.nivelTensaoGlobal ?? 0;
  const local = estado?.mundo?.localAtual || 'desconhecido';

  // 🧱 Blindagem estrutural (sandbox seguro)
  if (!Array.isArray(estado.eventosDisparados)) {
    estado.eventosDisparados = [];
  }

  if (!Array.isArray(estado.logMundo)) {
    estado.logMundo = [];
  }

  if (!Array.isArray(estado.historicoAcoes)) {
    return estado;
  }

  // 🧠 Pega a última ação registrada
  const ultimaAcao = estado.historicoAcoes.slice(-1)[0];
  if (!ultimaAcao) return estado;

  // 🛑 NOVA PROTEÇÃO CORRETA:
  // evita reprocessar a mesma ação infinitamente
  if (ultimaAcao.processadaPeloMestre) {
    return estado;
  }

  const descricao = (ultimaAcao.descricao || '').toLowerCase();

  // 🏚️ REGRA 1 — Explorar vila gera pistas reais
  if (descricao.includes('exploraram')) {
    estado.eventosDisparados.push({
      id: `pista_vila_${rodada}`,
      tipo: 'pistas_goblins',
      local,
    });

    estado.logMundo.push({
      tipo: 'pistas_encontradas',
      rodada,
      descricao:
        'Pegadas pequenas e marcas estranhas foram encontradas entre as casas abandonadas.',
    });
  }

  // 👁️ REGRA 2 — Investigar goblins gera ameaça concreta
  if (descricao.includes('investigaram')) {
    estado.eventosDisparados.push({
      id: `movimento_goblins_${rodada}`,
      tipo: 'movimento_inimigo',
      origem: 'floresta_proxima',
    });

    estado.logMundo.push({
      tipo: 'movimento_inimigo',
      rodada,
      descricao:
        'Batedores relatam movimentação de goblins nas redondezas da vila.',
    });

    if (estado.reacaoMundo) {
      estado.reacaoMundo.nivelTensaoGlobal += 1;
    }
  }

  // ⚠️ REGRA 3 — Alta tensão gera encontro jogável
  if (tensao >= 4 && !estado.encontroPendente) {
    estado.encontroPendente = {
      id: `emboscada_${rodada}`,
      tipo: 'emboscada_goblins',
      inimigos: ['goblins'],
      lider: 'feiticeiro_humano',
      perigo: 'alto',
      local,
      status: 'pendente',
      escolhas: ['lutar', 'fugir', 'esconder'],
    };

    estado.logMundo.push({
      tipo: 'encontro_iminente',
      rodada,
      descricao:
        'Sombras se movem entre as casas. Algo observa o grupo nas ruas silenciosas.',
    });
  }

  // 🔐 Marca a ação como já julgada pelo Mestre
  ultimaAcao.processadaPeloMestre = true;

  return estado;
}

module.exports = sistemaMestreCampanha;
