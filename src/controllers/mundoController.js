const mundoService = require('../services/mundoService');

function obterMapa(req, res) {
  try {
    const mapa = mundoService.obterMapa();

    res.json({
      sucesso: true,
      mapa,
    });
  } catch (erro) {
    console.error('Erro ao obter mapa:', erro);

    res.status(500).json({
      sucesso: false,
      erro: erro.message,
    });
  }
}

function obterLugarDetalhado(req, res) {
  try {
    const { localId } = req.params;

    const lugar = mundoService.obterLugarDetalhado(localId);

    res.json({
      sucesso: true,
      lugar,
    });
  } catch (erro) {
    console.error('Erro ao obter lugar detalhado:', erro);

    res.status(404).json({
      sucesso: false,
      erro: erro.message,
    });
  }
}

function obterSentimento(req, res) {
  try {
    const { sentimentoId } = req.params;

    const sentimento = mundoService.obterSentimento(sentimentoId);

    res.json({
      sucesso: true,
      sentimento,
    });
  } catch (erro) {
    console.error('Erro ao obter sentimento:', erro);

    res.status(404).json({
      sucesso: false,
      erro: erro.message,
    });
  }
}

function obterDesejo(req, res) {
  try {
    const { desejoId } = req.params;
    const fomeAtual = Number(req.query.fomeAtual ?? 12);

    const desejo = mundoService.obterDesejo(desejoId, fomeAtual);

    res.json({
      sucesso: true,
      desejo,
    });
  } catch (erro) {
    console.error('Erro ao obter desejo:', erro);

    res.status(404).json({
      sucesso: false,
      erro: erro.message,
    });
  }
}

function obterEfeito(req, res) {
  try {
    const { efeitoId } = req.params;

    const efeito = mundoService.obterEfeito(efeitoId, req.query);

    res.json({
      sucesso: true,
      efeito,
    });
  } catch (erro) {
    console.error('Erro ao calcular efeito:', erro);

    res.status(404).json({
      sucesso: false,
      erro: erro.message,
    });
  }
}

module.exports = {
  obterMapa,
  obterLugarDetalhado,
  obterSentimento,
  obterDesejo,
  obterEfeito,
};
