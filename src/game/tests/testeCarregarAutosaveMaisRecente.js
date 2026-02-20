const carregarAutosaveMaisRecente = require('../engine/campanha/persistencia/carregarAutosaveMaisRecente');
const sistemaHidratacaoEstadoCampanha = require('../engine/campanha/persistencia/sistemaHidratacaoEstadoCampanha');

console.log('=== TESTE DE CARREGAMENTO DO AUTOSAVE MAIS RECENTE ===');

try {
  // 1️⃣ Carrega o autosave mais recente disponível (1 → 2 → 3)
  const estadoCru = carregarAutosaveMaisRecente();

  console.log('\n📦 ESTADO CRU CARREGADO DO DISCO:');
  console.log({
    possuiMeta: !!estadoCru.meta,
    possuiMundo: !!estadoCru.mundo,
    chaves: Object.keys(estadoCru),
  });

  // 2️⃣ Hidrata o estado para formato runtime da engine
  const estadoHidratado = sistemaHidratacaoEstadoCampanha(estadoCru);

  console.log('\n🧬 ESTADO HIDRATADO (PRONTO PARA A ENGINE):');
  console.log({
    rodadaGlobal: estadoHidratado.rodadaGlobal,
    faseCampanha: estadoHidratado.faseCampanha,
    locaisAtivos: estadoHidratado.mapa?.locaisAtivos,
    totalNPCs: estadoHidratado.agentesMundo?.length,
    tendenciaMundo: estadoHidratado.perfilMundo?.tendencia,
  });

  console.log('\n📜 MEMÓRIA DO MUNDO (RESUMO):');
  console.log({
    linhaDoTempo: estadoHidratado.memoriaMundo?.linhaDoTempo?.length,
    regioesDescobertas: estadoHidratado.memoriaMundo?.regioesDescobertas,
    eventosHistoricos: estadoHidratado.memoriaMundo?.eventosHistoricos?.length,
  });

  console.log('\n✅ AUTOSAVE MAIS RECENTE CARREGADO COM SUCESSO E HIDRATADO.');
} catch (erro) {
  console.error('\n❌ ERRO AO CARREGAR AUTOSAVE MAIS RECENTE:');
  console.error(erro.message);
}
