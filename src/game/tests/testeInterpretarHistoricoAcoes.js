const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const interpretarHistoricoAcoes = require('../engine/campanha/interpretarHistoricoAcoes');

// 1️⃣ Cria estado inicial da campanha
const estado = criarEstadoCampanha(
  [
    { id: 'j1', nome: 'Jake' },
    { id: 'j2', nome: 'Luna' },
  ],
  'historia_teste'
);

// 2️⃣ Simula histórico de ações (como se o jogador tivesse jogado várias rodadas)
estado.historicoAcoes = [
  { acao: 'explorar_local', jogadorId: 'j1', rodada: 0 },
  { acao: 'explorar_local', jogadorId: 'j1', rodada: 1 },
  { acao: 'investigar', jogadorId: 'j1', rodada: 2 },
  { acao: 'explorar_local', jogadorId: 'j1', rodada: 3 },
];

console.log('=== ANTES DA INTERPRETAÇÃO ===');
console.log({
  perfilMundo: estado.perfilMundo,
  logMundo: estado.logMundo,
  historicoAcoes: estado.historicoAcoes,
});

// 3️⃣ Executa o cérebro narrativo do sandbox
interpretarHistoricoAcoes(estado);

console.log('\n=== DEPOIS DA INTERPRETAÇÃO ===');
console.log({
  perfilMundo: estado.perfilMundo,
  logMundo: estado.logMundo,
});
