// game/engine/executarAcao.js
const { resolverDesafio } = require('../desafios/resolverDesafio');
const { resolverAtaque } = require('./resolverAtaque');

function executarAcao(acao, contexto = {}) {
  switch (acao.tipo) {
    case 'desafio':
      return resolverDesafio(acao);

    case 'ataque':
      return resolverAtaque(acao, contexto);

    default:
      throw new Error(`Tipo de ação desconhecido: ${acao.tipo}`);
  }
}

module.exports = { executarAcao };
