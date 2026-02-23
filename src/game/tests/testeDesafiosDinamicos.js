// 🧪 testeDesafiosDinamicos.js
// Testa o surgimento de desafios dinâmicos baseados na tensão do mundo

const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const resolverRodadaCampanha = require('../engine/campanha/resolverRodadaCampanha');

// 👥 Jogadores simulados (estado leve da campanha)
const jogadores = [
  { id: 1, nome: 'Jake' },
  { id: 2, nome: 'Luna' },
];

// 🌍 Cria estado inicial da campanha
const estado = criarEstadoCampanha(jogadores, 'historia_teste');

// 🔧 Simula mundo já em progresso (para gerar tensão relevante)
estado.rodadaGlobal = 8;

// 🧠 Simula memória do mundo (exploração já ocorreu)
estado.memoriaMundo = {
  linhaDoTempo: [],
  regioesDescobertas: ['floresta_antiga', 'ruinas_sombrias'],
  eventosHistoricos: [],
  perfisRegistrados: [],
};

// 🏛 Simula reputação (mundo já observa o grupo)
estado.reputacao = {
  global: {
    fama: 5,
    honra: 2,
    suspeita: 3,
    reputacaoSocial: 4,
    titulos: [],
  },
  jogadores: {},
};

// 🌦 Simula reação do mundo já existente (alta tensão)
estado.reacaoMundo = {
  nivelTensaoGlobal: 4, // mundo tenso → maior chance de desafio
  ultimoClima: 'tenso',
  historicoTensoes: [],
};

console.log('🌍 ESTADO ANTES DA RODADA:');
console.log('Tensão:', estado.reacaoMundo.nivelTensaoGlobal);
console.log('Eventos Disparados:', estado.eventosDisparados);
console.log('Evento Ativo:', estado.eventoDramaticoAtivo);
console.log('-------------------------------------');

// 🧠 Processa a rodada completa (pipeline real da engine)
resolverRodadaCampanha(estado);

console.log('\n🌱 RESULTADO APÓS PROCESSAR RODADA:');
console.log('Tensão do Mundo:', estado.reacaoMundo);
console.log('\n🎯 Evento Dramático Ativo:');
console.log(estado.eventoDramaticoAtivo);

console.log('\n📦 Eventos Disparados:');
console.log(estado.eventosDisparados);

console.log('\n📜 Últimos Logs do Mundo:');
const ultimosLogs = estado.logMundo.slice(-5);
console.log(ultimosLogs);
