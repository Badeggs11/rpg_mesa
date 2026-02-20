function sistemaConsequencias(estado) {
  if (!estado) return estado;

  const perfil = estado.perfilMundo;
  if (!perfil) return estado;

  if (!estado.mapa) return estado;
  if (!estado.logMundo) estado.logMundo = [];
  if (!estado.eventosDisparados) estado.eventosDisparados = [];

  const tendencia = perfil.tendencia;

  // 🌍 CONSEQUÊNCIA 1 — Jogador explorador expande o mundo
  if (tendencia === 'explorador') {
    const novoLocal = `regiao_descoberta_${estado.rodadaGlobal}`;

    // Evita duplicar locais
    if (!estado.mapa.locaisAtivos.includes(novoLocal)) {
      estado.mapa.locaisAtivos.push(novoLocal);

      estado.logMundo.push({
        tipo: 'novo_local_descoberto',
        rodada: estado.rodadaGlobal,
        descricao: `Novas áreas foram descobertas devido ao espírito explorador do grupo.`,
        local: novoLocal,
      });
    }
  }

  // 🧠 CONSEQUÊNCIA 2 — Jogador investigador gera eventos narrativos
  if (tendencia === 'investigador') {
    const evento = `rumor_antigo_${estado.rodadaGlobal}`;

    if (!estado.eventosDisparados.includes(evento)) {
      estado.eventosDisparados.push(evento);

      estado.logMundo.push({
        tipo: 'rumor_descoberto',
        rodada: estado.rodadaGlobal,
        descricao: `Investigações recentes revelaram rumores sobre algo oculto no mundo.`,
        eventoId: evento,
      });
    }
  }

  // ⚔️ CONSEQUÊNCIA 3 — Jogador agressivo torna o mundo mais hostil (placeholder)
  if (tendencia === 'agressivo') {
    estado.logMundo.push({
      tipo: 'mundo_hostil',
      rodada: estado.rodadaGlobal,
      descricao: `A violência crescente do jogador está tornando o mundo mais hostil.`,
    });
  }

  return estado;
}

module.exports = sistemaConsequencias;
