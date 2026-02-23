const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const resolverRodadaCampanha = require('../engine/campanha/resolverRodadaCampanha');

const estado = criarEstadoCampanha([{ id: 1, nome: 'Jake' }], 'historia_teste');

// Simula evolução do mundo
estado.rodadaGlobal = 6;
estado.memoriaMundo = {
  regioesDescobertas: ['floresta', 'ruinas'],
};
estado.reputacao = {
  global: {
    fama: 6,
    honra: 2,
    suspeita: 3,
  },
};

resolverRodadaCampanha(estado);

console.log('Reação do Mundo:', estado.reacaoMundo);
console.log('Log do Mundo:', estado.logMundo);
