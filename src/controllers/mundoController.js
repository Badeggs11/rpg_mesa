const { mapaBase } = require('../game/world/mapas/mapaBase');

function obterMapa(req, res) {
  try {
    res.json({
      sucesso: true,
      mapa: mapaBase,
    });
  } catch (erro) {
    console.error('Erro ao obter mapa:', erro);

    res.status(500).json({
      sucesso: false,
      erro: erro.message,
    });
  }
}

module.exports = {
  obterMapa,
};
