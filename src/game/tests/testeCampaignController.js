async function executarTeste() {
  console.log('🌍 TESTE DO CAMPAIGN CONTROLLER (STORE REAL)');
  console.log('-------------------------------------------\n');

  try {
    // 🎮 1. Criar campanha VIA API (no store do servidor)
    const iniciarResponse = await fetch(
      'http://localhost:3000/api/campanha/iniciar',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jogadores: [{ id: 1, nome: 'Jake' }],
          historiaId: 'historia_api_teste',
        }),
      }
    );

    const iniciarData = await iniciarResponse.json();

    console.log('📡 RESPOSTA BRUTA (CRIAR CAMPANHA):');
    console.log(iniciarData);

    if (!iniciarData.sucesso) {
      console.log('❌ Falha ao iniciar campanha:', iniciarData.erro);
      return;
    }

    const campaignId = iniciarData.campaignId;

    console.log('\n🆔 Campaign criada no SERVIDOR:', campaignId);
    console.log('Rodada inicial:', iniciarData.estadoCampanha.rodadaGlobal);
    console.log('----------------------------------\n');

    // 🌍 2. Processar rodada usando o campaignId REAL do servidor
    const rodadaResponse = await fetch(
      'http://localhost:3000/api/campanha/rodada',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaignId,
        }),
      }
    );

    const rodadaText = await rodadaResponse.text();
    console.log('\n📡 RESPOSTA BRUTA (RODADA):');
    console.log(rodadaText);

    const data = JSON.parse(rodadaText);

    console.log('\n🌍 RESPOSTA DA API:');
    console.log('Sucesso:', data.sucesso);
    console.log('Combate iniciado?:', data.combateIniciado);

    if (!data.sucesso) {
      console.log('❌ Erro da API:', data.erro);
      return;
    }

    if (data.combateIniciado) {
      console.log('\n⚔️ COMBATE GERADO VIA CONTROLLER:');
      console.log({
        id: data.combate.id,
        atacante: data.combate.atacanteAtual,
        defensor: data.combate.defensorAtual,
        fase: data.combate.fase,
      });
    }

    console.log('\n📜 Log do Mundo (últimos):');
    console.log(data.estadoCampanha?.logMundo?.slice(-3) || []);
  } catch (erro) {
    console.error('❌ ERRO NO TESTE DO CONTROLLER:', erro.message);
  }
}

executarTeste();
