const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const registrarAcaoJogador = require('../engine/campanha/registrarAcaoJogador');
const finalizarTurnoJogador = require('../engine/campanha/finalizarTurnoJogador');

const salvarEstadoCampanha = require('../engine/campanha/persistencia/salvarEstadoCampanha');
const carregarEstadoCampanha = require('../engine/campanha/persistencia/carregarEstadoCampanha');

console.log('=== TESTE DE PERSISTÊNCIA DO MUNDO ===');

// 1️⃣ Cria campanha viva
const estado = criarEstadoCampanha(
  [
    { id: 'j1', nome: 'Jake' },
    { id: 'j2', nome: 'Luna' },
  ],
  'historia_teste'
);

// Simula ações no mundo
registrarAcaoJogador(estado, { tipo: 'explorar_local' });
finalizarTurnoJogador(estado);

registrarAcaoJogador(estado, { tipo: 'explorar_local' });
finalizarTurnoJogador(estado);

console.log('\n🌍 ESTADO ANTES DE SALVAR:');
console.log({
  rodadaGlobal: estado.rodadaGlobal,
  mapa: estado.mapa,
  memoria: estado.memoriaMundo,
});

// 2️⃣ SALVAR
const resultadoSave = salvarEstadoCampanha(estado, 'meu_mundo');
console.log('\n💾 SAVE REALIZADO EM:', resultadoSave.caminho);

// 3️⃣ CARREGAR
const estadoCarregado = carregarEstadoCampanha('meu_mundo');

console.log('\n📂 ESTADO CARREGADO DO DISCO:');
console.log({
  rodadaGlobal: estadoCarregado.meta.rodadaGlobal,
  mundo: estadoCarregado.mundo,
});
