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

    const jogador = estadoCampanha.jogadores.find(j => j.id === jogadorId);

    if (!jogador) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Jogador não encontrado na campanha',
      });
    }

    if (jogador.aprAtual <= 0) {
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
      case 'encerrar_turno':
        descricao = 'O jogador decidiu encerrar seu turno.';
        jogador.pronto = true;
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
