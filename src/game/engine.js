const { checarDificuldade } = require("./dice");

function executarDesafio(regra) {
  if (!regra.testes || !regra.dado || regra.dificuldade === undefined) {
    throw new Error("Regra de desafio inválida");
  }

  const resultado = checarDificuldade(
    regra.testes,
    regra.dado,
    regra.dificuldade
  );

  return {
    acao: regra.nome,
    ...resultado,
  };
}

module.exports = {
  executarDesafio,
};
