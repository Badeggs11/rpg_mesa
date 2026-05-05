const { v4: uuid } = require('uuid');
const { passadoPersonagens } = require('../../world/passadoPersonagens');

function criarEstadoCampanha(jogadores, historiaId) {
  // normaliza jogadores (igual você fez no combate)
  const jogadoresNormalizados = jogadores.map(j => ({
    id: j.id,
    nome: j.nome,
    vivo: true,
    pronto: false,

    // ❤️ Atributos principais vindos do banco
    pontosDeVida: j.pontosDeVida ?? 100,
    stamina: j.stamina ?? 0,
    percepcao: j.percepcao ?? 0,
    percepcaoVisual: j.percepcaoVisual ?? 0,
    forca: j.forca ?? 0,
    agilidade: j.agilidade ?? 0,
    resistencia: j.resistencia ?? 0,
    inteligencia: j.inteligencia ?? 0,

    // 🍖 Estados fisiológicos/sentimentos iniciais
    fome: j.fome ?? 12,

    // 🧠 Memória individual do personagem
    memoria: {
      background:
        passadoPersonagens[j.nome]?.background ||
        j.background ||
        `${j.nome} ainda não tem um passado definido, mas sua história começa agora.`,

      eventos: [],

      conhecimentos: [],

      relacoes: {},

      motivacoes: passadoPersonagens[j.nome]?.motivacoesIniciais || [],

      objetivoAtual: passadoPersonagens[j.nome]?.objetivoInicial || null,
    },

    estadoEmocional: {
      ansiedade:
        passadoPersonagens[j.nome]?.estadoEmocionalInicial?.ansiedade ?? 0,
      preocupacao:
        passadoPersonagens[j.nome]?.estadoEmocionalInicial?.preocupacao ?? 0,
      medo: passadoPersonagens[j.nome]?.estadoEmocionalInicial?.medo ?? 0,
      esperanca:
        passadoPersonagens[j.nome]?.estadoEmocionalInicial?.esperanca ?? 0,
    },

    // ⚡ Sistema de ações
    aprPorRodada: 2,
    aprAtual: 2,

    // 🧭 POSIÇÃO NO GRID
    posicao: {
      x: 0,
      y: 0,
    },
  }));

  return {
    // 🆔 IDENTIDADE DA CAMPANHA (ESSENCIAL)
    id: uuid(),
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

    // 🎯 OBJETIVO E MOTIVAÇÃO DA CAMPANHA (NÚCLEO NARRATIVO)
    objetivoCampanha: {
      motivacaoCentral: null, // será preenchida pela história
      objetivosAtivos: [],
      objetivosConcluidos: [],
    },

    // 🎭 narrativa dinâmica do mundo (separada do log técnico)
    narrativa: {
      cronicasPorRodada: [],
      narrativaGlobal: [],
    },

    // 🗺️ mapa do mundo
    mapa: {
      localAtual: 'praca_central',

      posicaoJogadores: jogadoresNormalizados.reduce((acc, jogador) => {
        acc[jogador.id] = {
          localAtual: 'praca_central',

          // posição inicial no mapa (centro da vila)
          pos: { x: 500, y: 300 },
        };

        return acc;
      }, {}),
    },

    // 🧭 exploração individual por jogador
    exploracao: jogadoresNormalizados.reduce((acc, jogador) => {
      acc[jogador.id] = {
        locaisDescobertos: ['praca_central'],
        locaisVisitados: [],
        nevoaDeGuerraAtiva: true,
      };
      return acc;
    }, {}),

    // 🎬 eventos dramáticos
    eventoDramaticoAtivo: null,
    eventosDisparados: [],

    // 🌦 estado sistêmico da reação do mundo (tensão global, clima, histórico)
    reacaoMundo: {
      nivelTensaoGlobal: 0,
      ultimoClima: 'estavel',
      historicoTensoes: [],
    },

    encontroPendente: null,
    decisaoEncontroPendente: null,
    gatilhoCombate: null,
    historicoEncontros: [],

    // 🎁 recompensas sistêmicas do mundo (NÃO aplicadas ainda no banco)
    recompensasPendentes: [],

    // 📜 log do mundo (igual log do combate)
    logMundo: [],
  };
}

module.exports = criarEstadoCampanha;
