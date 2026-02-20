const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const registrarAcaoJogador = require('../engine/campanha/registrarAcaoJogador');
const finalizarTurnoJogador = require('../engine/campanha/finalizarTurnoJogador');

console.log('=== TESTE NARRATIVA: MUNDO EXPLORADOR INTENSO ===');

const estado = criarEstadoCampanha(
  [
    { id: 'j1', nome: 'Jake' },
    { id: 'j2', nome: 'Luna' },
  ],
  'sandbox_explorador'
);

// 🔥 5 rodadas focadas só em exploração
for (let i = 0; i < 5; i++) {
  registrarAcaoJogador(estado, { tipo: 'explorar_local' });
  finalizarTurnoJogador(estado);

  registrarAcaoJogador(estado, { tipo: 'explorar_local' });
  finalizarTurnoJogador(estado);
}

console.log('\n🌍 TENDÊNCIA FINAL DO MUNDO:');
console.log(estado.perfilMundo);

console.log('\n📜 CRÔNICAS:');
console.log(estado.narrativa.cronicasPorRodada);

console.log('\n🌌 NARRATIVA GLOBAL:');
console.log(estado.narrativa.narrativaGlobal);
