function jogarDado(lados = 20) {
  return Math.floor(Math.random() * lados) + 1;
}

function jogarVariosDados(qtd, lados = 20) {
  const resultados = [];
  for (let i = 0; i < qtd; i++) {
    resultados.push(jogarDado(lados));
  }
  return resultados;
}

function jogarDadoComBonus(lados = 20, bonus = 0) {
  const jogada = jogarDado(lados);
  return {
    jogada,
    bonus,
    total: jogada + bonus,
  };
}
function checarDificuldade(qtdTestes, lados = 6, dificuldade = 4, bonus = 0) {
  const jogadas = [];
  let sucessos = 0;
  for (let i = 0; i < qtdTestes; i++) {
    const jogada = jogarDado(lados) + bonus;
    if (jogada >= dificuldade) {
      sucessos++;
    }
    jogadas.push(jogada);
  }
  return {
    testes: qtdTestes,
    sucessos,
    dificuldade,
    jogadas,
    bonus,
    sucessoParcial: sucessos > 0 && sucessos < qtdTestes,
    sucessoTotal: sucessos === qtdTestes,
    fracasso: sucessos === 0,
  };
}

module.exports = {
  jogarDado,
  jogarVariosDados,
  jogarDadoComBonus,
  checarDificuldade,
};
