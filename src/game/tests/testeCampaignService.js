const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const campaignService = require('../../services/campaignService');

// 👥 Jogadores fictícios (IDs precisam existir no banco!)
const jogadores = [
  { id: 1, nome: 'Jake' }, // deve existir no DB
];

// 🌍 Cria estado inicial da campanha
const estado = criarEstadoCampanha(jogadores, 'historia_teste');

// Simula avanço do mundo
estado.rodadaGlobal = 30;

// 🎯 Simula que o mundo já gerou um encontro perigoso
estado.encontroPendente = {
  id: 'encontro_campanha_30',
  rodada: 30,
  desafioId: 'desafio_sobrevivencia_30',
  origem: 'pressao_ambiental',
  status: 'pendente',
  tipo: 'emboscada',
  perigo: 'alto',
  descricao: 'Criaturas hostis emergem da floresta.',
  escolhas: ['lutar', 'fugir'],
};

// 🎮 Simula que o jogador decidiu LUTAR (igual ao fluxo real)
estado.gatilhoCombate = {
  origem: 'encontro_perigoso',
  encontroId: 'encontro_campanha_30',
  tipoEncontro: 'emboscada',
  perigo: 'alto',
  rodada: 30,
  status: 'pendente',
};

console.log('🎬 ESTADO INICIAL DA CAMPANHA');
console.log('Rodada:', estado.rodadaGlobal);
console.log('Gatilho Combate:', estado.gatilhoCombate);
console.log('----------------------------------');

async function executarTeste() {
  try {
    const resultado = await campaignService.processarRodada(estado);

    console.log('\n🌍 RESULTADO APÓS PROCESSAR RODADA DA CAMPANHA');
    console.log('Combate iniciado?:', resultado.combateIniciado);

    console.log('\n⚔️ DADOS DO COMBATE GERADO:');
    console.log(resultado.combate);

    console.log('\n🏷️ Gatilho de Combate (após consumo):');
    console.log(resultado.estadoCampanha.gatilhoCombate);

    console.log('\n📜 Últimos Logs do Mundo:');
    console.log(resultado.estadoCampanha.logMundo.slice(-3));
  } catch (erro) {
    console.error('❌ ERRO NO TESTE:', erro.message);
    console.error(erro);
  }
}

executarTeste();
