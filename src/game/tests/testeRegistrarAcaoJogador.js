const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const registrarAcaoJogador = require('../engine/campanha/registrarAcaoJogador');

// Cria estado inicial da campanha
const estado = criarEstadoCampanha(
  [
    { id: 'j1', nome: 'Jake' },
    { id: 'j2', nome: 'Luna' },
  ],
  'historia_teste'
);

console.log('=== ESTADO INICIAL ===');
console.log({
  rodadaGlobal: estado.rodadaGlobal,
  jogadorDaVez: estado.ciclo.jogadorDaVez,
  historicoAcoes: estado.historicoAcoes,
  logMundo: estado.logMundo,
});

// Simula uma ação do jogador atual
registrarAcaoJogador(estado, {
  tipo: 'explorar_local',
});

console.log('\n=== APÓS REGISTRAR AÇÃO ===');
console.log({
  rodadaGlobal: estado.rodadaGlobal,
  jogadorDaVez: estado.ciclo.jogadorDaVez,
  historicoAcoes: estado.historicoAcoes,
  logMundo: estado.logMundo,
});
