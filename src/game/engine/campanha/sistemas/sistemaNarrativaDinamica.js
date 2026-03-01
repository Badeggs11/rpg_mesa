const { gerarNarrativa } = require('../narrativa/mestreIA');

function sistemaNarrativaDinamica(estado) {
  if (!estado) return estado;

  // 🔰 Inicialização segura da estrutura narrativa
  if (!estado.narrativa) {
    estado.narrativa = {
      cronicasPorRodada: [],
      narrativaGlobal: [],
    };
  }

  if (!estado.memoriaMundo) return estado;

  const rodada = estado.rodadaGlobal;
  const perfil = estado.perfilMundo?.tendencia || 'desconhecida';
  const memoria = estado.memoriaMundo;

  // 📜 1️⃣ CRÔNICA POR RODADA (nível técnico-narrativo)
  const eventosDaRodada = (estado.logMundo || integrarLog(estado)).filter(
    e => e.rodada === rodada
  );

  let resumoEventos = '';

  const houveDescoberta = eventosDaRodada.some(
    e => e.tipo === 'novo_local_descoberto' || e.tipo === 'evento_dinamico'
  );

  const houveAcaoJogador = eventosDaRodada.some(
    e => e.tipo === 'acao_registrada'
  );

  const houveNpcAtivo = eventosDaRodada.some(
    e => e.tipo && e.tipo.startsWith('npc_')
  );

  // 🧠 Geração narrativa baseada em fatos reais do mundo
  if (houveDescoberta && perfil === 'explorador') {
    resumoEventos =
      'Impulsionados pelo espírito explorador, novas regiões começaram a emergir no mundo.';
  } else if (houveDescoberta) {
    resumoEventos =
      'Uma descoberta alterou discretamente o equilíbrio do mundo.';
  } else if (houveAcaoJogador && houveNpcAtivo) {
    resumoEventos =
      'Jogadores e habitantes do mundo agiram simultaneamente, dando continuidade ao fluxo natural do mundo.';
  } else if (houveAcaoJogador) {
    resumoEventos =
      'As ações dos jogadores influenciaram o rumo silencioso do mundo nesta rodada.';
  } else {
    resumoEventos =
      'O mundo seguiu seu curso silencioso, observando e evoluindo sem grandes rupturas.';
  }

  // 🎭 Camada literária (Mestre IA - interpretação do mundo)
  const narrativaIA = gerarNarrativa(estado, {
    descoberta: houveDescoberta ? 'alta' : 'nenhuma',
  });

  const cronicaRodada = {
    rodada,
    titulo: `Crônica da Rodada ${rodada}`,
    resumoFactual: resumoEventos, // mantém sua lógica atual intacta
    narracaoLiteraria: narrativaIA.narracao, // CAMADA EXTRA
    metadadosNarrativos: narrativaIA.metadados, // ouro para debug futuro
    tendenciaMundo: perfil,
    timestamp: Date.now(),
  };

  estado.narrativa.cronicasPorRodada.push(cronicaRodada);

  // 🌍 2️⃣ NARRATIVA GLOBAL (macro-história do mundo)
  if (rodada % 2 === 0) {
    // Atualiza narrativa macro a cada 2 rodadas (mais estável)
    const regioes = memoria.regioesDescobertas?.length || 0;
    const eventosHistoricos = memoria.eventosHistoricos?.length || 0;

    let narrativaMacro = '';

    if (perfil === 'explorador') {
      narrativaMacro =
        'O mundo atravessa uma era de expansão e descobertas, impulsionada pelas ações exploratórias.';
    } else if (perfil === 'agressivo') {
      narrativaMacro =
        'Conflitos e tensões começam a moldar o comportamento geral do mundo.';
    } else if (perfil === 'neutra') {
      narrativaMacro =
        'O mundo mantém um equilíbrio estável, reagindo gradualmente às ações dos seus habitantes.';
    } else {
      narrativaMacro =
        'O destino do mundo ainda se forma de maneira imprevisível.';
    }

    estado.narrativa.narrativaGlobal.push({
      rodada,
      descricao: narrativaMacro,
      estatisticas: {
        regioesDescobertas: regioes,
        eventosHistoricos,
        tendencia: perfil,
      },
      timestamp: Date.now(),
    });
  }

  // 📜 Log técnico (sem misturar com narrativa literária)
  if (!estado.logMundo) estado.logMundo = [];

  estado.logMundo.push({
    tipo: 'narrativa_atualizada',
    rodada,
    descricao:
      'A crônica do mundo foi atualizada com base nos acontecimentos da rodada.',
  });

  return estado;
}

module.exports = sistemaNarrativaDinamica;
