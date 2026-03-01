function criarEstadoCampanhaVilaAbandonada() {
  return {
    id: 'campanha_vila_goblins',

    rodadaGlobal: 0,
    faseCampanha: 'cicloJogadores',

    jogadores: [
      {
        id: 'j1',
        nome: 'Explorador',
        vivo: true,
        pronto: false,
        aprAtual: 2,
        aprPorRodada: 2,
      },
      {
        id: 'j2',
        nome: 'Guardião',
        vivo: true,
        pronto: false,
        aprAtual: 2,
        aprPorRodada: 2,
      },
      {
        id: 'j3',
        nome: 'Observador',
        vivo: true,
        pronto: false,
        aprAtual: 2,
        aprPorRodada: 2,
      },
    ],

    mundo: {
      localAtual: 'vila_abandonada',

      ameacasAtivas: [
        {
          id: 'horda_goblin_1',
          tipo: 'goblins',
          lider: 'feiticeiro_humano',
          local: 'floresta_sombria',
          nivelPerigo: 3,
          ativo: true,
        },
      ],

      perfilMundo: {
        tendencia: 'neutra',
        descricao: 'Uma vila em estado de abandono gradual.',
      },

      memoriaMundo: {
        linhaDoTempo: [],
        regioesDescobertas: ['vila_abandonada'],
        eventosHistoricos: [
          {
            tipo: 'ameaca_detectada',
            rodada: 0,
            descricao:
              'Moradores começaram a fugir após relatos de goblins nas redondezas.',
          },
          {
            tipo: 'rumor_feiticeiro',
            rodada: 0,
            descricao:
              'Rumores indicam que um feiticeiro humano está liderando os goblins.',
          },
        ],
      },
    },

    // 🔥 COMPATIBILIDADE COM SISTEMAS DA ENGINE (IMPORTANTE)
    memoriaMundo: null, // será sincronizada pelos sistemas
    mapa: {
      locaisAtivos: ['vila_abandonada', 'floresta_sombria'],
      regioesHostis: ['floresta_sombria'], // 🔥 CRÍTICO
      locaisBloqueados: [],
      conexoes: {},
    },

    reacaoMundo: {
      nivelTensaoGlobal: 2, // começa baixo (orgânico)
      ultimoClima: 'inquietante',
      historicoTensoes: [],
    },

    narrativa: {
      cronicasPorRodada: [],
      narrativaGlobal: [],
    },

    logMundo: [],

    eventosDisparados: [],
    eventoDramaticoAtivo: null,

    encontroPendente: null,
    decisaoEncontroPendente: null,
    gatilhoCombate: null,

    recompensasPendentes: [],
  };
}

module.exports = criarEstadoCampanhaVilaAbandonada;
