function sistemaAgentesMundo(estado) {
  if (!estado) return estado;

  const rodada = estado.rodadaGlobal;

  // Inicializa lista de agentes do mundo (NPCs)
  if (!estado.agentesMundo) {
    estado.agentesMundo = [
      {
        id: 'npc_explorador_1',
        tipo: 'explorador',
        localAtual: 'inicio',
        ativo: true,
      },
      {
        id: 'npc_viajante_1',
        tipo: 'viajante',
        localAtual: 'inicio',
        ativo: true,
      },
      {
        id: 'npc_observador_1',
        tipo: 'observador',
        localAtual: 'inicio',
        ativo: true,
      },
    ];
  }

  if (!estado.logMundo) {
    estado.logMundo = [];
  }

  if (!estado.eventosDisparados) {
    estado.eventosDisparados = [];
  }

  const mapa = estado.mapa;

  // Cada NPC age uma vez por rodada
  estado.agentesMundo.forEach(agente => {
    if (!agente.ativo) return;

    // 🗺 NPC EXPLORADOR — expande o mundo
    if (agente.tipo === 'explorador') {
      const novoLocal = `exploracao_npc_${rodada}`;

      if (!mapa.locaisAtivos.includes(novoLocal)) {
        mapa.locaisAtivos.push(novoLocal);

        estado.logMundo.push({
          tipo: 'npc_explorou_regiao',
          rodada,
          descricao: `Um explorador do mundo descobriu uma nova região.`,
          agenteId: agente.id,
          local: novoLocal,
        });
      }
    }

    // 🚶 NPC VIAJANTE — se move entre regiões conhecidas
    if (agente.tipo === 'viajante') {
      if (mapa.locaisAtivos.length > 0) {
        const indice = rodada % mapa.locaisAtivos.length;
        const destino = mapa.locaisAtivos[indice];

        agente.localAtual = destino;

        estado.logMundo.push({
          tipo: 'npc_viajou',
          rodada,
          descricao: `Um viajante percorreu o mundo e chegou a ${destino}.`,
          agenteId: agente.id,
          destino,
        });
      }
    }

    // 👁 NPC OBSERVADOR — reage aos eventos do mundo
    if (agente.tipo === 'observador') {
      const ultimoEvento = estado.eventosDisparados.slice(-1)[0];

      if (ultimoEvento) {
        estado.logMundo.push({
          tipo: 'npc_observou_evento',
          rodada,
          descricao: `Habitantes do mundo comentam sobre: ${ultimoEvento.tipo}.`,
          agenteId: agente.id,
          eventoObservado: ultimoEvento.id,
        });
      }
    }
  });

  return estado;
}

module.exports = sistemaAgentesMundo;
