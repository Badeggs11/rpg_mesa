function criarEstadoCampanha(jogadores, historiaId) {
  // normaliza jogadores (igual você fez no combate)
  const jogadoresNormalizados = jogadores.map(j => ({
    id: j.id,
    nome: j.nome,
    vivo: true,
    pronto: false, // importante para sistema de rodadas
  }));

  return {
    // 🌍 TEMPO GLOBAL DO MUNDO
    rodadaGlobal: 0,

    // 🎭 FASE DA CAMPANHA (igual fases do combate)
    faseCampanha: 'cicloJogadores',

    // 👥 jogadores da campanha
    jogadores: jogadoresNormalizados,

    // ⏳ tempo da rodada (novo sistema)
    tempoRodada: {
      inicioTimestamp: Date.now(),
      limiteMs: 180000, // 3 minutos por rodada
    },

    // 🔁 controle do ciclo de turnos
    ciclo: {
      ordemJogadores: jogadoresNormalizados.map(j => j.id),
      indiceAtual: 0,
      jogadorDaVez: jogadoresNormalizados[0]?.id || null,
    },

    // 📖 história ativa
    historia: {
      id: historiaId,
      localAtual: 'inicio', // depois virá do story.json
    },

    // 🎭 narrativa dinâmica do mundo (separada do log técnico)
    narrativa: {
      cronicasPorRodada: [],
      narrativaGlobal: [],
    },

    // 🗺️ mapa do mundo (simples por enquanto)
    mapa: {
      locaisAtivos: ['inicio'],
      locaisBloqueados: [],
      conexoes: {},
    },

    // 🎬 eventos dramáticos
    eventoDramaticoAtivo: null,
    eventosDisparados: [],

    // 📜 log do mundo (igual log do combate)
    logMundo: [],
  };
}

module.exports = criarEstadoCampanha;
