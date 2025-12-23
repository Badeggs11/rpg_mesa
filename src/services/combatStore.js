const combates = new Map();

function criarCombate(estado) {
  combates.set(estado.id, estado);
}

function obterCombate(id) {
  return combates.get(id);
}

function removerCombate(id) {
  combates.delete(id);
}

module.exports = {
  criarCombate,
  obterCombate,
  removerCombate,
};
