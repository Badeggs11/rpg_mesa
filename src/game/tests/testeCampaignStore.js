const {
  criarCampanha,
  obterCampanha,
  atualizarCampanha,
  removerCampanha,
  listarCampanhas,
} = require('../../services/campaignStore');

const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');

function executarTeste() {
  console.log('🌍 TESTE DO CAMPAIGN STORE (MULTI-MUNDOS)');
  console.log('-----------------------------------------\n');

  // 🎮 1. Criar duas campanhas diferentes (mundos paralelos)
  const campanha1 = criarEstadoCampanha(
    [{ id: 1, nome: 'Jake' }],
    'historia_mundo_1'
  );

  const campanha2 = criarEstadoCampanha(
    [{ id: 2, nome: 'Luna' }],
    'historia_mundo_2'
  );

  console.log('🆔 Campanha 1 ID:', campanha1.id);
  console.log('🆔 Campanha 2 ID:', campanha2.id);

  // 🗂️ 2. Registrar campanhas no store
  criarCampanha(campanha1);
  criarCampanha(campanha2);

  console.log('\n📦 Campanhas registradas no store:');
  console.log(
    listarCampanhas().map(c => ({
      id: c.id,
      historia: c.historia.id,
      rodada: c.rodadaGlobal,
    }))
  );

  // 🔍 3. Buscar campanha específica
  const buscada = obterCampanha(campanha1.id);

  console.log('\n🔎 Campanha buscada por ID:');
  console.log({
    id: buscada.id,
    historia: buscada.historia.id,
    rodada: buscada.rodadaGlobal,
  });

  // 🔄 4. Atualizar estado da campanha (simula avanço do mundo)
  buscada.rodadaGlobal = 5;
  atualizarCampanha(buscada.id, buscada);

  const atualizada = obterCampanha(buscada.id);

  console.log('\n🔄 Campanha após atualização de rodada:');
  console.log({
    id: atualizada.id,
    rodadaGlobal: atualizada.rodadaGlobal,
  });

  // 🧹 5. Remover uma campanha (simula mundo finalizado)
  removerCampanha(campanha2.id);

  console.log('\n🗑️ Após remover Campanha 2:');
  console.log(
    'Campanhas restantes:',
    listarCampanhas().map(c => c.id)
  );

  console.log('\n✅ TESTE DO CAMPAIGN STORE FINALIZADO');
}

executarTeste();
