function sistemaAgentesMundo(estado) {
  if (!estado) return estado;

  const rodada = estado.rodadaGlobal ?? 0;

  // 🧱 1. GARANTIA ESTRUTURAL DO ESTADO (ENGINE SANDBOX SAFE)

  // Mapa do mundo
  if (!estado.mapa) {
    estado.mapa = {
      locaisAtivos: ['vila_abandonada'],
      locaisBloqueados: [],
      conexoes: {},
    };
  }

  if (!Array.isArray(estado.mapa.locaisAtivos)) {
    estado.mapa.locaisAtivos = ['vila_abandonada'];
  }

  // Logs do mundo
  if (!Array.isArray(estado.logMundo)) {
    estado.logMundo = [];
  }

  // Eventos disparados (usado pelo observador)
  if (!Array.isArray(estado.eventosDisparados)) {
    estado.eventosDisparados = [];
  }

  // 🤖 2. INICIALIZAÇÃO SEGURA DOS AGENTES (CORREÇÃO DO SEU ERRO)
  if (!Array.isArray(estado.agentesMundo)) {
    estado.agentesMundo = [
      {
        id: 'npc_explorador_1',
        tipo: 'explorador',
        localAtual: 'vila_abandonada',
        ativo: true,
      },
      {
        id: 'npc_viajante_1',
        tipo: 'viajante',
        localAtual: 'vila_abandonada',
        ativo: true,
      },
      {
        id: 'npc_observador_1',
        tipo: 'observador',
        localAtual: 'vila_abandonada',
        ativo: true,
      },
    ];

    estado.logMundo.push({
      tipo: 'agentes_inicializados',
      rodada,
      descricao: 'Agentes autônomos do mundo foram inicializados.',
    });
  }

  const mapa = estado.mapa;

  // 🌍 3. CADA AGENTE AGE UMA VEZ POR RODADA (SISTEMA DETERMINÍSTICO)
  estado.agentesMundo.forEach(agente => {
    if (!agente || !agente.ativo) return;

    // 🗺 NPC EXPLORADOR — expande o mundo organicamente
    if (agente.tipo === 'explorador') {
      const novoLocal = `exploracao_npc_${rodada}`;

      if (!mapa.locaisAtivos.includes(novoLocal)) {
        mapa.locaisAtivos.push(novoLocal);

        estado.logMundo.push({
          tipo: 'npc_explorou_regiao',
          rodada,
          descricao: `Um explorador descobriu uma nova região: ${novoLocal}.`,
          agenteId: agente.id,
          local: novoLocal,
        });
      }
    }

    // 🚶 NPC VIAJANTE — se move entre locais conhecidos
    else if (agente.tipo === 'viajante') {
      if (mapa.locaisAtivos.length > 0) {
        const indice = rodada % mapa.locaisAtivos.length;
        const destino = mapa.locaisAtivos[indice];

        const origem = agente.localAtual;
        agente.localAtual = destino;

        estado.logMundo.push({
          tipo: 'npc_viajou',
          rodada,
          descricao: `Um viajante partiu de ${origem} e chegou a ${destino}.`,
          agenteId: agente.id,
          origem,
          destino,
        });
      }
    }

    // 👁 NPC OBSERVADOR — comenta os eventos do mundo
    else if (agente.tipo === 'observador') {
      const ultimoEvento =
        estado.eventosDisparados.length > 0
          ? estado.eventosDisparados[estado.eventosDisparados.length - 1]
          : null;

      if (ultimoEvento) {
        estado.logMundo.push({
          tipo: 'npc_observou_evento',
          rodada,
          descricao: `Habitantes comentam sobre o evento: ${ultimoEvento.tipo}.`,
          agenteId: agente.id,
          eventoObservado: ultimoEvento.id || ultimoEvento.tipo,
        });
      } else {
        // Observação passiva do mundo (importante para campanhas orgânicas)
        estado.logMundo.push({
          tipo: 'npc_observacao_passiva',
          rodada,
          descricao:
            'Os habitantes observam o mundo em silêncio, aguardando mudanças.',
          agenteId: agente.id,
        });
      }
    }
  });

  return estado;
}

module.exports = sistemaAgentesMundo;
