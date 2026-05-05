const passadoJake = {
  personagemNome: 'Jake',

  background:
    'Jake é um garoto de 13 anos que vive com sua mãe em uma pequena casa da vila. Seu pai foi convocado pelo rei para a guerra e nunca mais retornou. Desde então, Jake se tornou responsável pela casa. Sua mãe está debilitada e doente, e a falta de alimento começou a se tornar um problema real.',

  origem: 'residente_da_vila',

  motivacoesIniciais: [
    'conseguir alimento para sua mãe',
    'proteger sua casa',
    'descobrir se ainda há notícias sobre seu pai',
  ],

  estadoEmocionalInicial: {
    ansiedade: 6,
    preocupacao: 8,
    medo: 3,
    esperanca: 4,
  },

  objetivoInicial:
    'Encontrar uma forma de conseguir comida ou dinheiro para sustentar sua mãe doente.',
};

module.exports = { passadoJake };
