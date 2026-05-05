const {
  conversarComNPC,
} = require('../game/engine/campanha/interacoes/sistemaDialogoNPC');
const { npcs } = require('../game/world/npcs');
const campaignService = require('../services/campaignService');
const { consumirAPR } = require('../game/engine/campanha/sistemas/sistemaAPR');
const finalizarTurnoJogador = require('../game/engine/campanha/finalizarTurnoJogador');
const {
  explorarLocal,
} = require('../game/engine/campanha/sistemas/sistemaExploracaoMapa');

const {
  gerarNarrativa,
} = require('../game/engine/campanha/narrativa/mestreIA');

const {
  obterCampanha,
  criarCampanha,
  listarCampanhas,
} = require('../services/campaignStore');

const criarEstadoCampanha = require('../game/engine/campanha/criarEstadoCampanha');

// 🌍 INICIAR NOVA CAMPANHA (cria o mundo vivo no servidor)
async function iniciarCampanha(req, res) {
  try {
    const { jogadores, historiaId } = req.body || {};

    // 🧭 Se o frontend não enviar jogadores (como no ArenaCampanha),
    // usamos um grupo padrão sandbox
    const jogadoresValidos =
      jogadores && Array.isArray(jogadores) && jogadores.length > 0
        ? jogadores
        : [
            { id: 'j1', nome: 'Explorador' },
            { id: 'j2', nome: 'Guardião' },
            { id: 'j3', nome: 'Observador' },
          ];

    // 🌱 Cria estado inicial do mundo (engine pura)
    const estadoInicial = criarEstadoCampanha(
      jogadoresValidos,
      historiaId || 'vila_abandonada'
    );

    // 🗂️ Registra a campanha no STORE (memória viva do servidor)
    criarCampanha(estadoInicial);

    return res.json({
      sucesso: true,
      campaignId: estadoInicial.id,
      estadoCampanha: estadoInicial,
    });
  } catch (e) {
    console.error('Erro ao iniciar campanha:', e);

    return res.status(500).json({
      sucesso: false,
      erro: e.message,
    });
  }
}

// 🎮 NOVO — EXECUTAR AÇÃO DO JOGADOR (ESSENCIAL PARA O FRONTEND)
async function executarAcaoCampanha(req, res) {
  console.log('BODY:', req.body);

  try {
    const { campaignId, jogadorId, tipoAcao } = req.body || {};

    // 🧭 Validação básica
    if (!campaignId) {
      return res.status(400).json({
        sucesso: false,
        erro: 'campaignId não fornecido',
      });
    }

    // 🌍 Buscar mundo vivo no store (FONTE ÚNICA DA VERDADE)
    const estadoCampanha = obterCampanha(campaignId);

    // ✅ PRIMEIRO valida se existe
    if (!estadoCampanha) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Campanha não encontrada no campaignStore',
      });
    }

    // ✅ SÓ DEPOIS usa
    const jogador = estadoCampanha.jogadores.find(j => j.id === jogadorId);

    if (!jogador) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Jogador não encontrado na campanha',
      });
    }
    const conversaEmAndamento =
      tipoAcao === 'conversar' && req.body?.falaJogador;

    if (jogador.aprAtual <= 0 && !conversaEmAndamento) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Jogador sem APR disponível',
      });
    }

    if (!estadoCampanha) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Campanha não encontrada no campaignStore',
      });
    }

    // 🎯 valida jogadorId
    if (!jogadorId) {
      return res.status(400).json({
        sucesso: false,
        erro: 'jogadorId não fornecido',
      });
    }

    // 🧭 garante que existe ciclo (caso algum estado antigo esteja incompleto)
    if (!estadoCampanha.ciclo) {
      estadoCampanha.ciclo = {
        ordemJogadores: (estadoCampanha.jogadores || []).map(j => j.id),
        indiceAtual: 0,
        jogadorDaVez: estadoCampanha.jogadores?.[0]?.id || null,
      };
    }

    if (estadoCampanha.ciclo.jogadorDaVez !== jogadorId) {
      return res.status(400).json({
        sucesso: false,
        erro: `Não é a vez do jogador ${jogadorId}. Vez atual: ${estadoCampanha.ciclo.jogadorDaVez}`,
      });
    }

    // 🧱 Blindagem estrutural (sandbox seguro)
    if (!estadoCampanha.historicoAcoes) {
      estadoCampanha.historicoAcoes = [];
    }

    if (!estadoCampanha.logMundo) {
      estadoCampanha.logMundo = [];
    }

    if (!Array.isArray(estadoCampanha.eventosDisparados)) {
      estadoCampanha.eventosDisparados = [];
    }

    if (!estadoCampanha.reacaoMundo) {
      estadoCampanha.reacaoMundo = { nivelTensaoGlobal: 0 };
    }

    const rodadaAtual = estadoCampanha.rodadaGlobal ?? 0;
    const localAtual = estadoCampanha?.mapa?.localAtual || 'vila_abandonada';

    let descricao = '';

    // 🎭 Tradução da UI → Linguagem do Mestre da Campanha
    switch (tipoAcao) {
      case 'conversar_barman': {
        const npc = npcs['jose_barman'];

        const relacao = jogador.memoria.relacoes['jose_barman'] || {
          confianca: 0,
        };

        let fala = '';

        if (relacao.confianca <= 0) {
          fala = 'José olha desconfiado: "Não te conheço. O que você quer?"';
        } else if (relacao.confianca <= 3) {
          fala = 'José responde com cautela: "Se for rápido, posso ouvir."';
        } else {
          fala =
            'José relaxa um pouco: "Se precisar de trabalho ou comida, talvez eu tenha algo pra você."';
        }

        // 🧠 registra relação
        if (!jogador.memoria.relacoes['jose_barman']) {
          jogador.memoria.relacoes['jose_barman'] = { confianca: 0 };
        }

        jogador.memoria.relacoes['jose_barman'].confianca += 1;

        descricao = fala;

        break;
      }
      case 'mover': {
        const destinoEscolhido = req.body.destino;
        const resultadoDado = req.body.resultadoDado;

        const {
          calcularCustoMovimento,
        } = require('../game/engine/campanha/movimento/calcularCustoMovimento');
        const moverJogadorNoMapa = require('../game/engine/campanha/movimento/sistemaMovimentoMapa');
        const { mapaBase } = require('../game/world/mapas/mapaBase');

        const posicaoAtual =
          estadoCampanha.mapa.posicaoJogadores[jogadorId]?.pos;

        if (!posicaoAtual) {
          return res.status(400).json({
            sucesso: false,
            erro: 'Posição do jogador não encontrada',
          });
        }

        const destinoInfo = mapaBase[destinoEscolhido];

        if (!destinoInfo) {
          return res.status(400).json({
            sucesso: false,
            erro: 'Destino inválido',
          });
        }

        console.log('DEBUG mover -> posicaoAtual:', posicaoAtual);
        console.log('DEBUG mover -> destinoInfo:', destinoInfo);

        const resultadoMovimento = calcularCustoMovimento({
          origem: posicaoAtual,
          destino: destinoInfo.pos || destinoInfo,
          resultadoDado,
          progressoAnterior: jogador.progressoMovimento || 0,
        });
        // acumula progresso
        jogador.progressoMovimento = resultadoMovimento.progressoAcumulado;

        descricao = `${jogador.nome} tentou ir para ${destinoEscolhido} (rolou ${resultadoDado})`;

        // se conseguiu mover
        if (resultadoMovimento.conseguiuMover) {
          moverJogadorNoMapa(estadoCampanha, jogadorId, destinoEscolhido);

          jogador.progressoMovimento = 0;

          descricao = `${jogador.nome} chegou em ${destinoEscolhido}`;
        }

        consumirAPR(estadoCampanha, jogadorId, 1);

        if (jogador.aprAtual <= 0) {
          jogador.pronto = true;
        }

        if (jogador.pronto) {
          finalizarTurnoJogador(estadoCampanha);
        }

        break;
      }

      case 'conversar': {
        const { npcId, falaJogador } = req.body;

        if (!npcId) {
          return res.status(400).json({
            sucesso: false,
            erro: 'npcId não fornecido',
          });
        }

        const resultadoDialogo = conversarComNPC(
          estadoCampanha,
          jogadorId,
          npcId,
          falaJogador
        );

        descricao = resultadoDialogo.descricao;

        if (!falaJogador) {
          consumirAPR(estadoCampanha, jogadorId, 1);

          if (jogador.aprAtual <= 0) {
            jogador.pronto = true;
          }

          if (jogador.pronto) {
            finalizarTurnoJogador(estadoCampanha);
          }
        }

        break;
      }

      case 'encerrar_turno':
        descricao = `${jogador.nome} decidiu encerrar seu turno preservando ${jogador.aprAtual} APR.`;
        jogador.pronto = true;

        finalizarTurnoJogador(estadoCampanha);
        break;

      case 'explorar':
        explorarLocal(estadoCampanha, jogadorId);

        descricao = `${jogador.nome} explorou os arredores da vila.`;

        consumirAPR(estadoCampanha, jogadorId, 1);

        if (jogador.aprAtual <= 0) {
          jogador.pronto = true;
        }

        if (jogador.pronto) {
          finalizarTurnoJogador(estadoCampanha);
        }

        break;

      case 'investigar':
        descricao =
          'Os jogadores investigaram rumores sobre goblins nas redondezas.';

        // investigação gera evento orgânico no mundo
        estadoCampanha.eventosDisparados.push({
          id: `investigacao_${rodadaAtual}`,
          tipo: 'investigacao_goblins',
          local: localAtual,
        });

        // aumenta tensão de forma orgânica
        estadoCampanha.reacaoMundo.nivelTensaoGlobal += 1;

        consumirAPR(estadoCampanha, jogadorId, 1);

        if (jogador.aprAtual <= 0) {
          jogador.pronto = true;
        }

        if (jogador.pronto) {
          finalizarTurnoJogador(estadoCampanha);
        }

        break;

      case 'observar':
        descricao =
          'O grupo observou atentamente o ambiente silencioso da vila.';

        consumirAPR(estadoCampanha, jogadorId, 1);

        if (jogador.aprAtual <= 0) {
          jogador.pronto = true;
        }

        if (jogador.pronto) {
          finalizarTurnoJogador(estadoCampanha);
        }

        break;

      case 'descansar':
        descricao = 'O grupo descansou para recuperar forças na vila.';
        if (estadoCampanha.reacaoMundo.nivelTensaoGlobal > 0) {
          estadoCampanha.reacaoMundo.nivelTensaoGlobal -= 1;
        }

        consumirAPR(estadoCampanha, jogadorId, 1);

        if (jogador.aprAtual <= 0) {
          jogador.pronto = true;
        }

        if (jogador.pronto) {
          finalizarTurnoJogador(estadoCampanha);
        }

        break;

      // Ações de encontro perigoso (vindas do frontend)
      case 'encontro_lutar':
      case 'encontro_fugir':
      case 'encontro_esconder':
        estadoCampanha.decisaoEncontroPendente = tipoAcao.replace(
          'encontro_',
          ''
        );
        descricao = `O grupo decidiu: ${estadoCampanha.decisaoEncontroPendente}.`;
        break;

      default:
        return res.status(400).json({
          sucesso: false,
          erro: 'tipoAcao inválido',
        });
    }

    // 📜 Alimenta o cérebro interpretativo (interpretarHistoricoAcoes + Mestre)
    estadoCampanha.historicoAcoes.push({
      tipo: 'acao_registrada',
      rodada: rodadaAtual,
      jogadorId,
      jogadorNome: jogador.nome,
      acao: tipoAcao,
      descricao,
    });

    // 🧠 REGISTRAR NA MEMÓRIA DO JOGADOR
    if (!jogador.memoria) {
      jogador.memoria = {
        background: '',
        eventos: [],
        conhecimentos: [],
        relacoes: {},
      };
    }

    jogador.memoria.eventos.push({
      tipo: tipoAcao,
      descricao,
      rodada: rodadaAtual,
    });

    const narracao = gerarNarrativa(estadoCampanha);

    if (!estadoCampanha.narrativa) {
      estadoCampanha.narrativa = { cronicasPorRodada: [] };
    }

    estadoCampanha.narrativa.cronicasPorRodada.push({
      rodada: estadoCampanha.rodadaGlobal,
      resumo: narracao.narracao,
    });

    estadoCampanha.logMundo.push({
      tipo: 'acao_jogadores',
      rodada: rodadaAtual,
      jogadorId,
      descricao,
    });

    // 🧠 Processar mundo (engine macro + mestre + narrativa + encontros)
    let resultado = {
      estadoCampanha,
      combate: null,
      combateIniciado: false,
    };

    // só processa o mundo quando TODOS os jogadores terminaram
    const todosProntos = estadoCampanha.jogadores.every(j => j.pronto);

    if (todosProntos) {
      resultado = await campaignService.processarRodada(estadoCampanha);
    }
    return res.json({
      sucesso: true,
      estadoCampanha: resultado.estadoCampanha,
      combate: resultado.combate,
      combateIniciado: resultado.combateIniciado,
    });
  } catch (e) {
    console.error('Erro ao executar ação da campanha:', e);

    return res.status(500).json({
      sucesso: false,
      erro: e.message,
    });
  }
}

// 🔄 PROCESSAR UMA RODADA DO MUNDO (debug / sandbox)
async function processarRodada(req, res) {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        sucesso: false,
        erro: 'campaignId não fornecido',
      });
    }

    const estadoCampanha = obterCampanha(campaignId);

    if (!estadoCampanha) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Campanha não encontrada no campaignStore',
      });
    }

    const resultado = await campaignService.processarRodada(estadoCampanha);

    return res.json({
      sucesso: true,
      estadoCampanha: resultado.estadoCampanha,
      combate: resultado.combate,
      combateIniciado: resultado.combateIniciado,
    });
  } catch (e) {
    console.error('Erro ao processar rodada da campanha:', e);

    return res.status(500).json({
      sucesso: false,
      erro: e.message,
    });
  }
}

// 📚 Listar campanhas vivas (debug arquitetural)
function listarCampanhasAtivas(req, res) {
  try {
    const campanhas = listarCampanhas();

    return res.json({
      sucesso: true,
      campanhas: campanhas.map(c => ({
        id: c.id,
        historia: c.historia?.id,
        rodadaGlobal: c.rodadaGlobal,
      })),
    });
  } catch (e) {
    console.error('Erro ao listar campanhas:', e);

    return res.status(500).json({
      sucesso: false,
      erro: e.message,
    });
  }
}

async function moverJogador(req, res) {
  try {
    const { estadoCampanha, jogadorId, destino } = req.body;

    const estadoAtualizado = campaignService.moverJogadorMapa(
      estadoCampanha,
      jogadorId,
      destino
    );

    res.json({
      sucesso: true,
      estado: estadoAtualizado,
    });
  } catch (erro) {
    console.error('Erro ao mover jogador:', erro);

    res.status(500).json({
      sucesso: false,
      erro: erro.message,
    });
  }
}

module.exports = {
  iniciarCampanha,
  executarAcaoCampanha, // ⭐ ESSENCIAL PARA O FRONTEND FUNCIONAR
  processarRodada,
  listarCampanhasAtivas,
  moverJogador,
};
