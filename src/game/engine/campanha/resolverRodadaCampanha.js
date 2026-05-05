const interpretarHistoricoAcoes = require('./interpretarHistoricoAcoes');
const sistemaConsequencias = require('./sistemas/sistemaConsequencias');
const sistemaEventosDinamicos = require('./sistemas/sistemaEventosDinamicos');
const sistemaMemoriaMundo = require('./sistemas/sistemaMemoriaMundo');
const sistemaAgentesMundo = require('./sistemas/sistemaAgentesMundo');
const autosaveCampanha = require('./persistencia/autosaveCampanha');
const { aplicarAPRNaNovaRodada } = require('./sistemas/sistemaAPR');
const { iniciarTempoRodada } = require('./sistemas/sistemaTempoRodada');
const sistemaNarrativaDinamica = require('./sistemas/sistemaNarrativaDinamica');
const sistemaReputacaoJogador = require('./sistemas/sistemaReputacaoJogador');
const sistemaReacaoDoMundo = require('./sistemas/sistemaReacaoDoMundo');
const sistemaDesafiosDinamicos = require('./sistemas/sistemaDesafiosDinamicos');
const sistemaResolucaoDesafios = require('./sistemas/sistemaResolucaoDesafios');
const sistemaRecompensasContextuais = require('./sistemas/sistemaRecompensasContextuais');
const sistemaEncontrosPerigosos = require('./sistemas/sistemaEncontrosPerigosos');
const sistemaResolverDecisaoEncontro = require('./sistemas/sistemaResolverDecisaoEncontro');
const sistemaMestreCampanha = require('./sistemas/sistemaMestreCampanha');
const { gerarNarrativa } = require('../campanha/narrativa/mestreIA');
const { explorarLocal } = require('./sistemas/sistemaExploracaoMapa');
const sistemaPercepcaoEspacial = require('./sistemas/sistemaPercepcaoEspacial');
const { mapaBase } = require('../../world/mapas/mapaBase');
const { calcularCampoVisao } = require('./percepcao/calcularCampoVisao');

function resolverRodadaCampanha(estado) {
  console.log('🌍 RESOLVER RODADA CAMPANHA FOI EXECUTADO');
  // Garantia de segurança
  if (!estado) return estado;

  // Inicializa estruturas futuras (sandbox ready)
  if (!estado.eventosDisparados) {
    estado.eventosDisparados = [];
  }

  if (!estado.eventoDramaticoAtivo) {
    estado.eventoDramaticoAtivo = null;
  }

  if (!estado.logMundo) {
    estado.logMundo = [];
  }

  // 🍖 Sistema de fome — decai a cada rodada processada
  if (estado?.jogadores?.length) {
    estado.jogadores.forEach(jogador => {
      if (typeof jogador.fome !== 'number') {
        jogador.fome = 12;
      }

      jogador.fome = Math.max(0, jogador.fome - 2);
    });

    estado.logMundo.push({
      tipo: 'fome_atualizada',
      rodada: estado.rodadaGlobal,
      descricao: 'A fome dos jogadores aumentou com o passar do tempo.',
    });
  }

  // 🌍 REGRA 1 — O mundo reage ao tempo
  estado.logMundo.push({
    tipo: 'mundo_processado',
    rodada: estado.rodadaGlobal,
    descricao: `O mundo reagiu às ações dos jogadores na rodada ${estado.rodadaGlobal}`,
  });

  // 🧠 NOVO: cérebro sandbox (INTERPRETA O JOGADOR)
  interpretarHistoricoAcoes(estado);

  // 🗺️ Sistema de percepção espacial (exploração física do mundo)
  if (estado.ultimaAcaoJogador === 'explorar') {
    const jogadorId = estado?.ciclo?.jogadorDaVez;

    if (jogadorId) {
      sistemaPercepcaoEspacial(estado, jogadorId, mapaBase);
    }
  }

  // 🔎 TESTE — cálculo de campo de visão do jogador
  console.log('DEBUG PERCEPCAO - inicio');

  const jogadorIdTeste = estado?.ciclo?.jogadorDaVez;

  console.log('DEBUG jogadorDaVez:', jogadorIdTeste);

  const posicaoJogador = estado?.mapa?.posicaoJogadores;

  console.log('DEBUG posicaoJogadores:', posicaoJogador);

  if (jogadorIdTeste && posicaoJogador) {
    const campoVisao = calcularCampoVisao(
      posicaoJogador[jogadorIdTeste].pos,
      3
    );

    console.log('CAMPO DE VISAO DO JOGADOR:', campoVisao);

    // 🔎 Detectar locais do mapa dentro do campo de visão

    Object.values(mapaBase).forEach(local => {
      const visivel = campoVisao.some(
        tile => tile.x === local.pos.x && tile.y === local.pos.y
      );

      if (visivel) {
        console.log('🏠 LOCAL VISÍVEL:', local.nome);

        const exploracaoJogador = estado.exploracao[jogadorIdTeste];

        console.log('DEBUG EXPLORACAO ANTES:', exploracaoJogador);

        if (!exploracaoJogador.locaisDescobertos.includes(local.id)) {
          exploracaoJogador.locaisDescobertos.push(local.id);

          estado.logMundo.push({
            rodada: estado.rodadaGlobal,
            tipo: 'local_descoberto',
            descricao: `Um novo local foi descoberto: ${local.nome}`,
          });
          console.log('DEBUG EXPLORACAO DEPOIS:', exploracaoJogador);
        }
      }
    });
  }

  // 🎩 MESTRE DE CAMPANHA (AVALIA AS AÇÕES DOS JOGADORES)
  sistemaMestreCampanha(estado);

  // 🌍 2. Aplicar consequências reais (reação)
  sistemaConsequencias(estado);

  // 🎭 3. Gera acontecimentos narrativos emergentes (NOVO)
  sistemaEventosDinamicos(estado);

  // ⚔️ 4. Resolver decisão de encontros perigosos (NOVO - CRÍTICO)
  if (estado.decisaoEncontroPendente) {
    sistemaResolverDecisaoEncontro(estado, estado.decisaoEncontroPendente);

    // limpa a decisão após processar (evento consumido)
    estado.decisaoEncontroPendente = null;
  }

  // 4️⃣ Memória histórica do universo (CRÔNICA DO MUNDO) ⭐
  sistemaMemoriaMundo(estado);

  // 🏛 Reputação social do grupo (o mundo observa)
  sistemaReputacaoJogador(estado);

  // 🌦 REAÇÃO SISTÊMICA DO MUNDO (tensão, clima, pressão gradual)
  sistemaReacaoDoMundo(estado);

  // 🎯 NOVO — Oportunidades emergentes baseadas na tensão
  sistemaDesafiosDinamicos(estado);

  // ⚠️ NOVO — Resolução híbrida por contexto
  sistemaResolucaoDesafios(estado);

  // Registra um encontro perigoso no estado quando a pressão ambiental está ativa.
  sistemaEncontrosPerigosos(estado);

  // Gera recompensas baseadas em desafios/pressões enfrentadas.
  sistemaRecompensasContextuais(estado);

  // 🎭 NARRATIVA (DEPOIS DA MEMÓRIA + REAÇÃO)
  sistemaNarrativaDinamica(estado);

  // 🎩 Mestre da campanha narra o que aconteceu
  const narracaoMestre = gerarNarrativa(estado);

  console.log('MESTRE NARRANDO:', narracaoMestre);

  if (!estado.narrativa) {
    estado.narrativa = {};
  }

  if (!estado.narrativa.cronicasPorRodada) {
    estado.narrativa.cronicasPorRodada = [];
  }

  estado.narrativa.cronicasPorRodada.push({
    rodada: estado.rodadaGlobal,
    resumo: narracaoMestre.narracao,
  });

  // 5. 🌍 Agentes autônomos do mundo (NPCs vivos) ⭐
  sistemaAgentesMundo(estado);

  // 💾 AUTOSAVE DO MUNDO (após processamento completo da rodada)
  autosaveCampanha(estado);

  // após avançar rodadaGlobal
  aplicarAPRNaNovaRodada(estado);

  // ⏳ reinicia o relógio da nova rodada (mundo nunca para)
  iniciarTempoRodada(estado);

  // 🌱 (HOOK SANDBOX FUTURO)
  // Aqui entrarão:
  // - eventos dinâmicos
  // - reações de facções
  // - evolução do mapa
  // - consequências das escolhas

  return estado;
}

module.exports = resolverRodadaCampanha;
