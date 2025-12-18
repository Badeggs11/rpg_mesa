const { resolverDesafio } = require("./resolverDesafio");
const { resolverAtaque } = require("./resolverAtaque");

function executarAcao(acao, contexto = {}) {
  switch (acao.tipo) {
    case "desafio":
      return resolverDesafio(acao);

    case "ataque":
      if (!contexto.defesa) {
        throw new Error("Ataque requer uma defesa escolhida");
      }
      return resolverAtaque(acao, contexto.defesa);

    default:
      throw new Error(`Tipo de ação desconhecido: ${acao.tipo}`);
  }
}

module.exports = { executarAcao };
