const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const registrarAcaoJogador = require('../engine/campanha/registrarAcaoJogador');
const finalizarTurnoJogador = require('../engine/campanha/finalizarTurnoJogador');
const {
  tempoRodadaEsgotado,
} = require('../engine/campanha/sistemas/sistemaTempoRodada');
const { consumirAPR } = require('../engine/campanha/sistemas/sistemaAPR');

console.log('=== TESTE SISTEMA TEMPO + APR + SANDBOX ===');

// 1️⃣ Criar estado inicial
const estado = criarEstadoCampanha(
  [
    { id: 'j1', nome: 'Jake' },
    { id: 'j2', nome: 'Luna' },
  ],
  'historia_teste'
);

console.log('\n📦 ESTADO INICIAL:');
console.log({
  rodadaGlobal: estado.rodadaGlobal,
  tempoRodada: estado.tempoRodada,
  jogadorDaVez: estado.ciclo.jogadorDaVez,
});

// 2️⃣ Simular APR acumulado (cenário realista)
estado.jogadores.forEach(j => {
  j.aprAtual = 4; // simulando jogador guardando APR
});

console.log('\n⚡ APR INICIAL DOS JOGADORES:');
console.log(
  estado.jogadores.map(j => ({
    id: j.id,
    apr: j.aprAtual,
  }))
);

// 3️⃣ Jogador 1 age normalmente
console.log('\n--- Jogador j1 realiza ação (explorar) ---');

if (consumirAPR(estado, estado.ciclo.jogadorDaVez, 1)) {
  registrarAcaoJogador(estado, { tipo: 'explorar_local' });
}
finalizarTurnoJogador(estado);

// 4️⃣ Jogador 2 NÃO age (simula jogador lento/AFK)
console.log('\n--- Simulando jogador lento (tempo da rodada expira) ---');

// ⚠️ FORÇANDO EXPIRAÇÃO DO TEMPO (simulação de teste)
estado.tempoRodada.inicioTimestamp = Date.now() - 181000; // > 3 minutos

console.log('⏳ Tempo esgotado?', tempoRodadaEsgotado(estado));

// 5️⃣ Finaliza turno (deve forçar avanço automático da rodada)
finalizarTurnoJogador(estado);

console.log('\n🌍 APÓS EXPIRAÇÃO DO TEMPO DA RODADA:');
console.log({
  rodadaGlobal: estado.rodadaGlobal,
  jogadorDaVez: estado.ciclo.jogadorDaVez,
  tempoRodada: estado.tempoRodada,
});

console.log('\n🧠 VALIDAÇÃO DO APR ACUMULATIVO:');
estado.jogadores.forEach(j => {
  console.log(
    `Jogador ${j.id} → APR atual: ${j.aprAtual} (esperado >= 6 se acumulativo)`
  );
});

// 6️⃣ Verificar logs críticos do sistema
console.log('\n📜 LOG DO MUNDO (últimos eventos):');
console.log(estado.logMundo.slice(-6));

// 7️⃣ Verificar estado dos jogadores
console.log('\n👥 ESTADO DOS JOGADORES:');
console.log(
  estado.jogadores.map(j => ({
    id: j.id,
    pronto: j.pronto,
    apr: j.aprAtual,
  }))
);

// 8️⃣ Verificação específica do novo sistema APR acumulativo
console.log('\n⚡ TESTE ESPECÍFICO: APR ACUMULATIVO');
console.log(
  estado.jogadores.map(j => ({
    id: j.id,
    aprAtual: j.aprAtual,
    aprPorRodada: j.aprPorRodada,
  }))
);
console.log('\n✅ TESTE CONCLUÍDO: Tempo + APR + Engine Sandbox integrada.');
