// 🧪 testeResolucaoDesafios.js
// Testa o modelo híbrido:
// - Desafio latente (região segura)
// - Desafio ativo (região perigosa + alta tensão)

const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const resolverRodadaCampanha = require('../engine/campanha/resolverRodadaCampanha');
const sistemaResolucaoDesafios = require('../engine/campanha/sistemas/sistemaResolucaoDesafios');

// 👥 Jogadores simulados
const jogadores = [
  { id: 1, nome: 'Jake' },
  { id: 2, nome: 'Luna' },
];

function prepararEstadoBase() {
  const estado = criarEstadoCampanha(jogadores, 'historia_teste');

  // Simula mundo avançado
  estado.rodadaGlobal = 12;

  // 🌦 Alta tensão do mundo
  estado.reacaoMundo = {
    nivelTensaoGlobal: 6,
    ultimoClima: 'tenso',
    historicoTensoes: [],
  };

  // 🧠 Memória do mundo (com região hostil registrada)
  estado.memoriaMundo = {
    linhaDoTempo: [],
    regioesDescobertas: ['floresta_sombria'],
    regioesHostis: ['floresta_sombria'], // 🔥 importante para ativação contextual
    eventosHistoricos: [],
    perfisRegistrados: [],
  };

  // 🎯 Desafio já existente (gerado pelo mundo)
  estado.eventoDramaticoAtivo = {
    id: 'desafio_sobrevivencia_12',
    tipo: 'evento_dinamico',
    categoria: 'desafio',
    rodada: 12,
    desafio: 'desafio_sobrevivencia',
    subtipo: 'ambiente_hostil',
    descricao:
      'As condições do mundo se tornaram mais severas, exigindo adaptação dos aventureiros.',
    opcional: true,
    origem: 'mundo_sistemico',
  };

  estado.eventosDisparados = [estado.eventoDramaticoAtivo];

  return estado;
}

// ==========================================
// 🟢 CENÁRIO 1 — REGIÃO SEGURA (deve ficar LATENTE)
// ==========================================
const estadoSeguro = prepararEstadoBase();
estadoSeguro.historia.localAtual = 'inicio'; // região segura

console.log('🟢 CENÁRIO 1 — REGIÃO SEGURA');
console.log('Local Atual:', estadoSeguro.historia.localAtual);
console.log('Tensão:', estadoSeguro.reacaoMundo.nivelTensaoGlobal);
console.log(
  'Estado do Desafio ANTES:',
  estadoSeguro.eventoDramaticoAtivo.estado || 'indefinido'
);

resolverRodadaCampanha(estadoSeguro);

console.log('\nResultado após rodada:');
console.log('Estado do Desafio:', estadoSeguro.eventoDramaticoAtivo.estado);
console.log('Desafios Ativos:', estadoSeguro.desafiosAtivos || []);
console.log('------------------------------------------\n');

// ==========================================
// 🔴 CENÁRIO 2 — REGIÃO HOSTIL (deve ATIVAR)
// ==========================================
const estadoHostil = prepararEstadoBase();
estadoHostil.historia.localAtual = 'floresta_sombria'; // região perigosa

console.log('🔴 CENÁRIO 2 — REGIÃO HOSTIL');
console.log('Local Atual:', estadoHostil.historia.localAtual);
console.log('Tensão:', estadoHostil.reacaoMundo.nivelTensaoGlobal);
console.log(
  'Estado do Desafio ANTES:',
  estadoHostil.eventoDramaticoAtivo.estado || 'indefinido'
);

sistemaResolucaoDesafios(estadoHostil);

console.log('\nResultado após rodada:');
console.log('Estado do Desafio:', estadoHostil.eventoDramaticoAtivo.estado);
console.log('Desafios Ativos:', estadoHostil.desafiosAtivos || []);
console.log('\nÚltimos Logs do Mundo:');
console.log(estadoHostil.logMundo.slice(-5));
