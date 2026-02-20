const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const registrarAcaoJogador = require('../engine/campanha/registrarAcaoJogador');
const finalizarTurnoJogador = require('../engine/campanha/finalizarTurnoJogador');

console.log('=== INICIANDO TESTE ARQUITETURAL COMPLETO ===');

// 1️⃣ Criar estado inicial da campanha
const estado = criarEstadoCampanha(
  [
    { id: 'j1', nome: 'Jake' },
    { id: 'j2', nome: 'Luna' },
  ],
  'historia_teste'
);

console.log('\n=== ESTADO INICIAL ===');
console.log({
  rodadaGlobal: estado.rodadaGlobal,
  jogadorDaVez: estado.ciclo.jogadorDaVez,
  perfilMundo: estado.perfilMundo,
  mapa: estado.mapa,
  eventosDisparados: estado.eventosDisparados,
  logMundo: estado.logMundo,
});

// 2️⃣ Jogador 1 realiza ações (simulando comportamento sandbox)
console.log('\n--- Jogador j1 explora ---');
registrarAcaoJogador(estado, { tipo: 'explorar_local' });

// Finaliza turno do jogador 1
finalizarTurnoJogador(estado);

// 3️⃣ Jogador 2 realiza uma ação diferente
console.log('\n--- Jogador j2 investiga ---');
registrarAcaoJogador(estado, { tipo: 'investigar' });

// Finaliza turno do jogador 2 (isso deve fechar o ciclo e avançar a rodada)
finalizarTurnoJogador(estado);

console.log('\n=== APÓS 1 CICLO COMPLETO (RODADA GLOBAL) ===');
console.log({
  rodadaGlobal: estado.rodadaGlobal,
  jogadorDaVez: estado.ciclo.jogadorDaVez,
  perfilMundo: estado.perfilMundo,
  mapa: estado.mapa,
  eventosDisparados: estado.eventosDisparados,
});

console.log('\n=== LOG DO MUNDO ===');
console.log(estado.logMundo);

// 4️⃣ Novo ciclo para reforçar comportamento do jogador
console.log('\n--- Novo ciclo: j1 continua explorando ---');
registrarAcaoJogador(estado, { tipo: 'explorar_local' });
finalizarTurnoJogador(estado);

registrarAcaoJogador(estado, { tipo: 'explorar_local' });
finalizarTurnoJogador(estado);

console.log('\n=== APÓS 2 CICLOS (COMPORTAMENTO CONSISTENTE) ===');
console.log({
  rodadaGlobal: estado.rodadaGlobal,
  perfilMundo: estado.perfilMundo,
});

console.log('\n=== EVENTOS DISPARADOS (estrutura técnica) ===');
console.log(estado.eventosDisparados);

console.log('\n=== LOG FINAL DO MUNDO ===');
console.log(estado.logMundo);

console.log('\n=== MEMÓRIA DO MUNDO (histórico persistente) ===');
console.log(estado.memoriaMundo);

console.log('\n=== AGENTES DO MUNDO ===');
console.log(estado.agentesMundo);
