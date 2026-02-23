// src/services/campaignStore.js

// 🗂️ Memória das campanhas ativas (sandbox vivo)
const campanhas = new Map();

/**
 * Cria e registra uma nova campanha na memória
 */
function criarCampanha(estadoCampanha) {
  if (!estadoCampanha || !estadoCampanha.id) {
    throw new Error('Estado da campanha precisa de um id');
  }

  campanhas.set(estadoCampanha.id, estadoCampanha);
  return estadoCampanha;
}

/**
 * Obtém campanha pelo ID
 */
function obterCampanha(campaignId) {
  return campanhas.get(campaignId);
}

/**
 * Atualiza campanha existente (após processamento da rodada)
 */
function atualizarCampanha(campaignId, novoEstado) {
  if (!campanhas.has(campaignId)) {
    throw new Error('Campanha não encontrada');
  }

  campanhas.set(campaignId, novoEstado);
  return novoEstado;
}

/**
 * Remove campanha (futuro: finalizar mundo)
 */
function removerCampanha(campaignId) {
  return campanhas.delete(campaignId);
}

/**
 * Lista campanhas ativas (debug / admin)
 */
function listarCampanhas() {
  return Array.from(campanhas.values());
}

module.exports = {
  criarCampanha,
  obterCampanha,
  atualizarCampanha,
  removerCampanha,
  listarCampanhas,
};
