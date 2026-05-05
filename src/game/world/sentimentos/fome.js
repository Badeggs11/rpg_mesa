const fome = {
  id: 'fome',
  nome: 'Fome',
  escala: {
    minimo: 0,
    maximo: 24,
    inicial: 12,
  },
  descricao:
    'Você sente um vazio leve no estômago. Ainda consegue agir, mas seu corpo já começa a lembrar que precisa de comida.',
  regra:
    'A fome diminui com o passar das rodadas. Quando fica abaixo de 12, começa a afetar atributos físicos.',
};

module.exports = { fome };
