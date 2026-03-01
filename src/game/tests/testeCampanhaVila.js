const resolverRodadaCampanha = require('../engine/campanha/resolverRodadaCampanha');
const criarEstadoCampanhaVilaAbandonada = require('../stories/cenarioVilaAbandonada');

let estado = criarEstadoCampanhaVilaAbandonada();

for (let i = 0; i < 15; i++) {
  estado.rodadaGlobal += 1;
  estado = resolverRodadaCampanha(estado);

  const ultimaCronica =
    estado.narrativa.cronicasPorRodada[
      estado.narrativa.cronicasPorRodada.length - 1
    ];

  console.log('\n==============================');
  console.log(`🌍 RODADA ${estado.rodadaGlobal}`);
  console.log('📜 Resumo Factual:', ultimaCronica?.resumoFactual);
  console.log('🎭 Narrativa:', ultimaCronica?.narracaoLiteraria);
  console.log('🔥 Tensão:', estado.reacaoMundo?.nivelTensaoGlobal);
}
