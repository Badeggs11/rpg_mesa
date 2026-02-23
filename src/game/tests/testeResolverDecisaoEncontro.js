const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const sistemaResolverDecisaoEncontro = require('../engine/campanha/sistemas/sistemaResolverDecisaoEncontro');

// 👥 jogadores fictícios
const jogadores = [
  { id: 1, nome: 'Jake' },
  { id: 2, nome: 'Luna' },
];

// 🌍 cria estado inicial da campanha
const estado = criarEstadoCampanha(jogadores, 'historia_teste');

// Simula rodada avançada (mundo já perigoso)
estado.rodadaGlobal = 25;

// ⚔️ Injeta manualmente um encontro perigoso (como se viesse do sistemaEncontrosPerigosos)
estado.encontroPendente = {
  id: 'encontro_teste_25',
  rodada: 25,
  desafioId: 'desafio_sobrevivencia_25',
  origem: 'pressao_ambiental',
  status: 'pendente',
  tipo: 'emboscada',
  perigo: 'alto',
  descricao: 'Uma presença hostil observa nas sombras.',
  escolhas: ['lutar', 'fugir'],
};

console.log('🎬 ESTADO INICIAL:');
console.log('Encontro Pendente:', estado.encontroPendente);
console.log('Gatilho Combate:', estado.gatilhoCombate);
console.log('Histórico Encontros:', estado.historicoEncontros);
console.log('----------------------------------');

// 🎮 CENÁRIO 1 — Jogador escolhe LUTAR
console.log('\n⚔️ CENÁRIO 1 — DECISÃO: LUTAR');
sistemaResolverDecisaoEncontro(estado, { tipo: 'lutar' });

console.log('Gatilho de Combate:');
console.log(estado.gatilhoCombate);

console.log('\nHistórico de Encontros:');
console.log(estado.historicoEncontros);

console.log('\nEncontro Pendente (após lutar):');
console.log(estado.encontroPendente);

console.log('\nÚltimos Logs do Mundo:');
console.log(estado.logMundo.slice(-2));

// 🔄 Reinicia encontro para testar fuga
estado.encontroPendente = {
  id: 'encontro_teste_26',
  rodada: 26,
  desafioId: 'desafio_sobrevivencia_26',
  origem: 'pressao_ambiental',
  status: 'pendente',
  tipo: 'emboscada',
  perigo: 'alto',
  descricao: 'O perigo ainda ronda a região.',
  escolhas: ['lutar', 'fugir'],
};

estado.rodadaGlobal = 26;

// 🏃 CENÁRIO 2 — Jogador escolhe FUGIR
console.log('\n🏃 CENÁRIO 2 — DECISÃO: FUGIR');
sistemaResolverDecisaoEncontro(estado, { tipo: 'fugir' });

console.log('Encontro Pendente (após fugir):');
console.log(estado.encontroPendente);

console.log('\nHistórico de Encontros atualizado:');
console.log(estado.historicoEncontros);

console.log('\nÚltimos Logs do Mundo:');
console.log(estado.logMundo.slice(-2));
