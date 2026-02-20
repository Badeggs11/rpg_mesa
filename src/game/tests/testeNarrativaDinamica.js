const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const registrarAcaoJogador = require('../engine/campanha/registrarAcaoJogador');
const finalizarTurnoJogador = require('../engine/campanha/finalizarTurnoJogador');

console.log('=== TESTE DO SISTEMA DE NARRATIVA DINÂMICA ===');

// 1️⃣ Criar estado inicial da campanha
const estado = criarEstadoCampanha(
  [
    { id: 'j1', nome: 'Jake' },
    { id: 'j2', nome: 'Luna' },
  ],
  'historia_narrativa_teste'
);

console.log('\n📦 ESTADO INICIAL (ANTES DA NARRATIVA):');
console.log({
  rodadaGlobal: estado.rodadaGlobal,
  narrativa: estado.narrativa,
  memoriaMundo: estado.memoriaMundo,
});

// 2️⃣ Simular ações que geram impacto narrativo
console.log('\n--- Rodada 0: Jogador j1 explora ---');
registrarAcaoJogador(estado, { tipo: 'explorar_local' });
finalizarTurnoJogador(estado);

console.log('\n--- Rodada 0: Jogador j2 investiga ---');
registrarAcaoJogador(estado, { tipo: 'investigar' });
finalizarTurnoJogador(estado);

// Agora a rodada global deve avançar para 1
console.log('\n🌍 APÓS 1ª RODADA GLOBAL:');
console.log({
  rodadaGlobal: estado.rodadaGlobal,
  tendenciaMundo: estado.perfilMundo?.tendencia,
});

// 3️⃣ Segunda rodada com comportamento explorador consistente
console.log('\n--- Rodada 1: j1 continua explorando ---');
registrarAcaoJogador(estado, { tipo: 'explorar_local' });
finalizarTurnoJogador(estado);

console.log('\n--- Rodada 1: j2 também explora ---');
registrarAcaoJogador(estado, { tipo: 'explorar_local' });
finalizarTurnoJogador(estado);

// Agora deve gerar narrativa mais forte (perfil explorador)
console.log('\n🌟 APÓS 2ª RODADA (COM NARRATIVA EMERGENTE):');
console.log({
  rodadaGlobal: estado.rodadaGlobal,
  tendenciaMundo: estado.perfilMundo?.tendencia,
});

// 4️⃣ Exibir crônicas por rodada (NÍVEL 1)
console.log('\n📜 CRÔNICAS POR RODADA:');
console.log(
  estado.narrativa?.cronicasPorRodada?.map(c => ({
    rodada: c.rodada,
    titulo: c.titulo,
    resumo: c.resumo,
    tendencia: c.tendenciaMundo,
  }))
);

// 5️⃣ Exibir narrativa global (NÍVEL 2)
console.log('\n🌍 NARRATIVA GLOBAL DO MUNDO:');
console.log(estado.narrativa?.narrativaGlobal);

// 6️⃣ Validar separação técnica vs narrativa (arquitetura correta)
console.log('\n🧠 VALIDAÇÃO ARQUITETURAL:');
console.log({
  possuiLogTecnico: Array.isArray(estado.logMundo),
  possuiNarrativaSeparada: !!estado.narrativa,
  totalLogsTecnicos: estado.logMundo.length,
  totalCronicas: estado.narrativa?.cronicasPorRodada?.length,
});

// 7️⃣ Mostrar último trecho narrativo (efeito literário do sandbox)
const ultimaCronica =
  estado.narrativa?.cronicasPorRodada?.[
    estado.narrativa.cronicasPorRodada.length - 1
  ];

console.log('\n🎭 ÚLTIMA CRÔNICA DO MUNDO:');
console.log(ultimaCronica);

console.log(
  '\n✅ TESTE CONCLUÍDO: Sistema de Narrativa Dinâmica integrado à Engine Sandbox.'
);
