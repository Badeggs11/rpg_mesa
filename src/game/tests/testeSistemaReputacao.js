const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const registrarAcaoJogador = require('../engine/campanha/registrarAcaoJogador');
const finalizarTurnoJogador = require('../engine/campanha/finalizarTurnoJogador');

console.log('=== TESTE SISTEMA DE REPUTAÇÃO (SANDBOX SOCIAL) ===');

const estado = criarEstadoCampanha(
  [
    { id: 'j1', nome: 'Jake', vivo: true },
    { id: 'j2', nome: 'Luna', vivo: true },
  ],
  'historia_reputacao'
);

// Simular comportamento explorador consistente
for (let i = 0; i < 3; i++) {
  registrarAcaoJogador(estado, { tipo: 'explorar_local' });
  finalizarTurnoJogador(estado);

  registrarAcaoJogador(estado, { tipo: 'explorar_local' });
  finalizarTurnoJogador(estado);
}

console.log('\n🌍 REPUTAÇÃO GLOBAL:');
console.log(estado.reputacao.global);

console.log('\n👥 REPUTAÇÃO DOS JOGADORES:');
console.log(estado.reputacao.jogadores);

console.log('\n📜 LOG SOCIAL (últimos eventos):');
console.log(
  estado.logMundo.filter(
    l => l.tipo.includes('reputacao') || l.tipo.includes('titulo')
  )
);
