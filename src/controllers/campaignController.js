const campaignService = require('../services/campaignService');
const {
  obterCampanha,
  criarCampanha,
  listarCampanhas,
} = require('../services/campaignStore');

const criarEstadoCampanha = require('../game/engine/campanha/criarEstadoCampanha');

// 🌍 INICIAR NOVA CAMPANHA (cria o mundo vivo no servidor)
async function iniciarCampanha(req, res) {
  try {
    const { jogadores, historiaId } = req.body;

    // 🧭 Validações básicas
    if (!jogadores || !Array.isArray(jogadores) || jogadores.length === 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Jogadores inválidos ou não fornecidos',
      });
    }

    // 🌱 Cria estado inicial do mundo (engine pura)
    const estadoInicial = criarEstadoCampanha(jogadores, historiaId);

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

// 🔄 PROCESSAR UMA RODADA DO MUNDO (cérebro sandbox)
async function processarRodada(req, res) {
  try {
    const { campaignId } = req.body;

    // 🧭 1. Validação
    if (!campaignId) {
      return res.status(400).json({
        sucesso: false,
        erro: 'campaignId não fornecido',
      });
    }

    // 🌍 2. Buscar mundo vivo no store (FONTE ÚNICA DA VERDADE)
    const estadoCampanha = obterCampanha(campaignId);

    if (!estadoCampanha) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Campanha não encontrada no campaignStore',
      });
    }

    // 🧠 3. Processar mundo (engine macro + gatilhos sistêmicos)
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

// 📚 (Opcional mas MUITO recomendado) — listar campanhas vivas
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

module.exports = {
  iniciarCampanha,
  processarRodada,
  listarCampanhasAtivas, // bônus arquitetural
};
