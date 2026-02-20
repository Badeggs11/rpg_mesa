function sistemaEventosDinamicos(estado) {
  if (!estado) return estado;

  const perfil = estado.perfilMundo;
  if (!perfil) return estado;

  if (!estado.eventosDisparados) {
    estado.eventosDisparados = [];
  }

  if (!estado.logMundo) {
    estado.logMundo = [];
  }

  const rodada = estado.rodadaGlobal;
  const tendencia = perfil.tendencia;

  // Evita eventos duplicados na mesma rodada
  const jaDisparouEventoNestaRodada = estado.eventosDisparados.some(
    e => e.rodada === rodada
  );

  if (jaDisparouEventoNestaRodada) {
    return estado;
  }

  // 🎭 EVENTO 1 — Explorador descobre algo no mundo
  if (tendencia === 'explorador') {
    const evento = {
      id: `evento_exploracao_${rodada}`,
      tipo: 'descoberta',
      rodada,
      descricao: 'Durante a exploração, algo antigo foi encontrado no mundo.',
    };

    estado.eventosDisparados.push(evento);

    estado.logMundo.push({
      tipo: 'evento_dinamico',
      rodada,
      descricao:
        'Uma descoberta emergiu devido ao comportamento explorador do grupo.',
      eventoId: evento.id,
    });

    return estado;
  }

  // 🕵️ EVENTO 2 — Investigador revela informações ocultas
  if (tendencia === 'investigador') {
    const evento = {
      id: `evento_investigacao_${rodada}`,
      tipo: 'segredo_revelado',
      rodada,
      descricao:
        'Pistas e segredos começaram a surgir após intensas investigações.',
    };

    estado.eventosDisparados.push(evento);

    estado.logMundo.push({
      tipo: 'evento_dinamico',
      rodada,
      descricao: 'Segredos do mundo começaram a se revelar.',
      eventoId: evento.id,
    });

    return estado;
  }

  // ⚔️ EVENTO 3 — Agressividade gera perigo no mundo
  if (tendencia === 'agressivo') {
    const evento = {
      id: `evento_perigo_${rodada}`,
      tipo: 'perigo_crescente',
      rodada,
      descricao: 'A violência recente atraiu perigos para a região.',
    };

    estado.eventosDisparados.push(evento);

    estado.logMundo.push({
      tipo: 'evento_dinamico',
      rodada,
      descricao: 'O mundo se tornou mais perigoso devido às ações agressivas.',
      eventoId: evento.id,
    });

    return estado;
  }

  // 🌫 Tendência neutra → mundo silencioso (intencional)
  estado.logMundo.push({
    tipo: 'mundo_silencioso',
    rodada,
    descricao:
      'O mundo observa em silêncio, sem grandes acontecimentos nesta rodada.',
  });

  return estado;
}

module.exports = sistemaEventosDinamicos;
