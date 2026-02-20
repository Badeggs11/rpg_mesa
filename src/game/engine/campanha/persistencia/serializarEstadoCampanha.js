function serializarEstadoCampanha(estado) {
  if (!estado) return null;

  // 🧠 Criamos uma cópia segura (evita mutação acidental)
  const estadoSerializado = {
    meta: {
      rodadaGlobal: estado.rodadaGlobal ?? 0,
      faseCampanha: estado.faseCampanha ?? 'cicloJogadores',
    },

    jogadores: estado.jogadores ?? [],

    ciclo: {
      ordemJogadores: estado.ciclo?.ordemJogadores ?? [],
      indiceAtual: estado.ciclo?.indiceAtual ?? 0,
      jogadorDaVez: estado.ciclo?.jogadorDaVez ?? null,
    },

    mundo: {
      mapa: estado.mapa ?? {
        locaisAtivos: [],
        locaisBloqueados: [],
        conexoes: {},
      },

      memoriaMundo: estado.memoriaMundo ?? {
        linhaDoTempo: [],
        regioesDescobertas: [],
        eventosHistoricos: [],
        perfisRegistrados: [],
      },

      agentesMundo: estado.agentesMundo ?? [],
      eventosDisparados: estado.eventosDisparados ?? [],
      perfilMundo: estado.perfilMundo ?? null,
    },

    historicoAcoes: estado.historicoAcoes ?? [],
    logMundo: estado.logMundo ?? [],
    historia: estado.historia ?? null,
  };

  return estadoSerializado;
}

module.exports = serializarEstadoCampanha;
