const { combateFisico } = require("../services/combatService");

async function executarCombate(req, res) {
  try {
    const resultado = await combateFisico(req.body);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
}

module.exports = {
  executarCombate,
};
