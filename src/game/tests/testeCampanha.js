// importa a função da engine
const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');

// jogadores fictícios (simulação)
const jogadores = [
  { id: 'j1', nome: 'Jake' },
  { id: 'j2', nome: 'Luna' },
  { id: 'j3', nome: 'Rurik' },
];

// cria o estado da campanha
const estado = criarEstadoCampanha(jogadores, 'historia_teste');

// imprime no console
console.log('ESTADO DA CAMPANHA:');
console.log(JSON.stringify(estado, null, 2));
