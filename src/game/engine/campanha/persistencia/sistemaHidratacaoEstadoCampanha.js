function sistemaHidratacaoEstadoCampanha(estadoCarregado) {
  if (!estadoCarregado) {
    throw new Error('Estado carregado inválido para hidratação.');
  }

  // 🧠 Estrutura base moderna da campanha
  const estadoHidratado = {
    // META DO SISTEMA
    rodadaGlobal: estadoCarregado.meta?.rodadaGlobal ?? 0,
    faseCampanha: estadoCarregado.meta?.faseCampanha ?? 'cicloJogadores',

    // JOGADORES
    jogadores: estadoCarregado.jogadores ?? [],

    // CICLO DE TURNOS
    ciclo: {
      ordemJogadores: estadoCarregado.ciclo?.ordemJogadores ?? [],
      indiceAtual: estadoCarregado.ciclo?.indiceAtual ?? 0,
      jogadorDaVez: estadoCarregado.ciclo?.jogadorDaVez ?? null,
    },

    // 🌍 MUNDO VIVO (núcleo sandbox)
    mapa: estadoCarregado.mundo?.mapa ?? {
      locaisAtivos: ['inicio'],
      locaisBloqueados: [],
      conexoes: {},
    },

    memoriaMundo: estadoCarregado.mundo?.memoriaMundo ?? {
      linhaDoTempo: [],
      regioesDescobertas: [],
      eventosHistoricos: [],
      perfisRegistrados: [],
    },

    agentesMundo: estadoCarregado.mundo?.agentesMundo ?? [],

    eventosDisparados: estadoCarregado.mundo?.eventosDisparados ?? [],

    perfilMundo: estadoCarregado.mundo?.perfilMundo ?? null,

    // HISTÓRICO DO JOGO
    historicoAcoes: estadoCarregado.historicoAcoes ?? [],

    // LOG NARRATIVO
    logMundo: estadoCarregado.logMundo ?? [],

    // HISTÓRIA ATIVA
    historia: estadoCarregado.historia ?? {
      id: 'historia_padrao',
      localAtual: 'inicio',
    },
  };

  // 🧪 GARANTIAS DE INTEGRIDADE (muito importante para saves antigos)
  if (!Array.isArray(estadoHidratado.logMundo)) {
    estadoHidratado.logMundo = [];
  }

  if (!Array.isArray(estadoHidratado.historicoAcoes)) {
    estadoHidratado.historicoAcoes = [];
  }

  if (!Array.isArray(estadoHidratado.agentesMundo)) {
    estadoHidratado.agentesMundo = [];
  }

  // 📜 Registro de hidratação (debug histórico)
  estadoHidratado.logMundo.push({
    tipo: 'estado_hidratado',
    rodada: estadoHidratado.rodadaGlobal,
    descricao:
      'O estado do mundo foi hidratado e reconstruído após carregamento do save.',
  });

  return estadoHidratado;
}

module.exports = sistemaHidratacaoEstadoCampanha;
