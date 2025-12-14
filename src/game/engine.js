const { checarDificuldade } = require("./dice");

function executarRegra(regra) {
  if (!regra.testes || !regra.dado) {
    throw new Error("Regra não executável");
  }

  const resultado = checarDificuldade(
    regra.testes,
    regra.dado,
    regra.dificuldade
  );

  let danoCausado = 0;

  if (regra.tipo === "ataque") {
    const maiorRolagem = Math.max(...resultado.rolagens);

    // 👉 dado + saldo ofensivo
    const ataqueTotal = maiorRolagem + regra.dificuldade;

    danoCausado = Math.max(0, ataqueTotal);
  }

  return {
    acao: regra.nome,
    tipo: regra.tipo,
    dificuldade: regra.dificuldade,
    rolagens: resultado.rolagens,
    sucessos: resultado.sucessos,
    danoCausado,
  };
}

module.exports = {
  executarRegra,
};
