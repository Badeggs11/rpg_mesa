const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const finalizarTurnoJogador = require('../engine/campanha/finalizarTurnoJogador');

const estado = criarEstadoCampanha(
  [
    { id: 'j1', nome: 'Jake' },
    { id: 'j2', nome: 'Luna' },
    { id: 'j3', nome: 'Rurik' },
  ],
  'historia_teste'
);

console.log('=== ESTADO INICIAL ===');
console.log(estado.ciclo);

// Simula 3 turnos (um ciclo completo)
finalizarTurnoJogador(estado);
finalizarTurnoJogador(estado);
finalizarTurnoJogador(estado);

console.log('=== APÓS 1 CICLO ===');
console.log('Rodada Global:', estado.rodadaGlobal);
console.log('Jogador da vez:', estado.ciclo.jogadorDaVez);
console.log('Log:', estado.logMundo);
