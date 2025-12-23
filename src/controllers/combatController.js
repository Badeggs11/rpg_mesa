const combatService = require('../services/combatService');

async function iniciarCombate(req, res) {
  try {
    const combate = await combateService.iniciarCombate(req.body);
    res.json(combate);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
}
async function executarAcao(req, res) {
  try {
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
