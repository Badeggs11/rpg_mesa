const combatService = require('../services/combatService');

async function iniciarCombate(req, res) {
  try {
    console.log('>>> /api/combate/acao', req.method, req.body);

    const combate = await combatService.iniciarCombate(req.body);
    res.json(combate);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
}
async function executarAcao(req, res) {
  try {
    console.log('>>> /api/combate/acao', req.method, req.body);

    const { combateId, ...payload } = req.body;
    const combate = await combatService.executarAcao(combateId, payload);
    res.json(combate);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
}

module.exports = {
  iniciarCombate,
  executarAcao,
};
