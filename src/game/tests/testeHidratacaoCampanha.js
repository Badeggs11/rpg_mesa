const carregarEstadoCampanha = require('../engine/campanha/persistencia/carregarEstadoCampanha');
const sistemaHidratacaoEstadoCampanha = require('../engine/campanha/persistencia/sistemaHidratacaoEstadoCampanha');

console.log('=== TESTE DE HIDRATAÇÃO DO MUNDO ===');

// 1️⃣ Carrega save cru do disco
const estadoCru = carregarEstadoCampanha('meu_mundo');

console.log('\n📦 ESTADO CRU (do disco):');
console.log(Object.keys(estadoCru));

// 2️⃣ Hidrata o estado para runtime da engine
const estadoHidratado = sistemaHidratacaoEstadoCampanha(estadoCru);

console.log('\n🧬 ESTADO HIDRATADO (pronto para engine):');
console.log({
  rodadaGlobal: estadoHidratado.rodadaGlobal,
  mapa: estadoHidratado.mapa,
  agentesMundo: estadoHidratado.agentesMundo?.length,
  memoriaMundo: estadoHidratado.memoriaMundo,
});
