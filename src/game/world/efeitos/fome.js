const efeitoFome = {
  id: 'efeito_fome',

  calcularPenalidade(fomeAtual) {
    if (fomeAtual >= 12) return 0;

    return Math.floor((12 - fomeAtual) / 2);
  },

  aplicarEfeito(jogador, fomeAtual) {
    const penalidade = this.calcularPenalidade(fomeAtual);

    return {
      penalidade,
      atributosAfetados: {
        forca: jogador.forca - penalidade,
        agilidade: jogador.agilidade - penalidade,
        resistencia: jogador.resistencia - penalidade,
        percepcao: jogador.percepcao - penalidade,
        percepcaoVisual: jogador.percepcaoVisual - penalidade,
        inteligencia: jogador.inteligencia - penalidade,
        stamina: jogador.stamina - penalidade,
      },
    };
  },
};

module.exports = { efeitoFome };
