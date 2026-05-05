const queroComer = {
  id: 'quero_comer',
  nome: 'Quero comer',
  sentimentoOrigem: 'fome',

  descricao:
    'Seu corpo pede comida. A fome começa a transformar necessidade em desejo claro: encontrar algo para comer.',

  calcularIntensidade(fomeAtual) {
    const fomeMaxima = 24;
    const faltaDeComida = fomeMaxima - fomeAtual;

    if (faltaDeComida <= 6) return 'baixa';
    if (faltaDeComida <= 12) return 'moderada';
    if (faltaDeComida <= 18) return 'alta';

    return 'crítica';
  },

  calcularQuantidadeDesejada(fomeAtual) {
    const fomeMaxima = 24;
    const faltaDeComida = fomeMaxima - fomeAtual;

    return Math.max(0, faltaDeComida);
  },
};

module.exports = { queroComer };
