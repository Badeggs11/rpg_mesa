const readline = require('readline');
const criarEstadoCampanhaVilaAbandonada = require('../stories/cenarioVilaAbandonada');
const resolverRodadaCampanha = require('../engine/campanha/resolverRodadaCampanha');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let estado = criarEstadoCampanhaVilaAbandonada();
function mostrarStatus() {
  const tensao = estado?.reacaoMundo?.nivelTensaoGlobal ?? 0;
  const rodada = estado.rodadaGlobal ?? 0;

  const cronica = estado.narrativa?.cronicasPorRodada?.slice(-1)[0];

  const narrativaLiteraria =
    estado.narrativa?.narrativaGlobal?.slice(-1)[0]?.descricao ||
    'O mundo aguarda ações dos jogadores.';

  console.log('==============================');
  console.log(`🌍 CAMPANHA: Vila Abandonada`);
  console.log(`🕰️ Rodada: ${rodada}`);
  console.log(`🔥 Tensão Global: ${tensao}`);
  console.log('------------------------------');

  // 📜 CRÔNICA TÉCNICA (estado do mundo)
  console.log(
    `📜 Crônica: ${cronica?.resumo || 'O mundo observa em silêncio.'}`
  );

  // 🎭 NARRATIVA DO MESTRE (camada literária)
  console.log(`🎭 Narrativa: ${narrativaLiteraria}`);

  // ⚠️ EVENTOS IMPORTANTES DO MUNDO (MESTRE)
  const ultimoLog = estado.logMundo?.slice(-3) || [];
  if (ultimoLog.length > 0) {
    console.log('\n📡 Eventos do Mundo:');
    ultimoLog.forEach(e => {
      console.log(`- ${e.descricao}`);
    });
  }

  // ⚔️ ENCONTRO PENDENTE (CRÍTICO PARA JOGABILIDADE)
  if (estado.encontroPendente) {
    console.log('\n🚨 AMEAÇA DETECTADA!');
    console.log(`Inimigos: ${estado.encontroPendente.inimigos}`);
    console.log(`Líder: ${estado.encontroPendente.lider}`);
    console.log(`Escolhas: ${estado.encontroPendente.escolhas.join(', ')}`);
  }

  console.log('==============================\n');
}

function menuAcoes() {
  console.log('🎮 Escolha sua ação:');
  console.log('1 - Explorar a vila abandonada');
  console.log('2 - Investigar rumores de goblins');
  console.log('3 - Observar o ambiente');
  console.log('4 - Descansar (reduz tensão levemente)');
  console.log('5 - Avançar rodada sem ação (debug)');
  console.log('0 - Sair\n');
}

function aplicarAcao(acao) {
  // 🧱 Blindagem estrutural (essencial em sandbox)
  if (!estado.historicoAcoes) {
    estado.historicoAcoes = [];
  }

  if (!estado.logMundo) {
    estado.logMundo = [];
  }

  if (!Array.isArray(estado.eventosDisparados)) {
    estado.eventosDisparados = [];
  }

  if (!estado.reacaoMundo) {
    estado.reacaoMundo = { nivelTensaoGlobal: 0 };
  }

  let descricao = '';

  switch (acao) {
    case '1':
      descricao = 'Os jogadores exploraram áreas vazias da vila.';
      break;

    case '2':
      descricao =
        'Os jogadores investigaram rumores sobre goblins nas redondezas.';

      estado.eventosDisparados.push({
        id: `rumor_${estado.rodadaGlobal}`,
        tipo: 'investigacao_goblins',
        local: estado.mundo?.localAtual || 'vila_abandonada',
      });

      // investigação atrai atenção da ameaça (orgânico!)
      estado.reacaoMundo.nivelTensaoGlobal += 1;
      break;
      descricao = 'Os jogadores investigaram rumores sobre goblins.';

      // agora nunca quebra
      estado.eventosDisparados.push({
        id: `rumor_${estado.rodadaGlobal}`,
        tipo: 'investigacao_goblins',
      });

      // bônus narrativo: investigação aumenta tensão orgânica
      estado.reacaoMundo.nivelTensaoGlobal += 1;
      break;

    case '3':
      descricao = 'O grupo observou atentamente o ambiente silencioso.';
      break;

    case '4':
      descricao = 'O grupo descansou para recuperar forças.';
      if (estado.reacaoMundo.nivelTensaoGlobal > 0) {
        estado.reacaoMundo.nivelTensaoGlobal -= 1;
      }
      break;

    case '5':
      descricao = 'Nenhuma ação relevante foi tomada nesta rodada.';
      break;

    default:
      return false;
  }

  estado.historicoAcoes.push({
    tipo: 'acao_registrada',
    rodada: estado.rodadaGlobal,
    descricao,
  });

  estado.logMundo.push({
    tipo: 'acao_jogadores',
    rodada: estado.rodadaGlobal,
    descricao,
  });

  return true;
}

function loopJogo() {
  mostrarStatus();
  menuAcoes();

  rl.question('> ', resposta => {
    const input = resposta.trim(); // 🔥 CORREÇÃO CRÍTICA

    if (input === '0') {
      console.log('Encerrando campanha...');
      rl.close();
      return;
    }

    const acaoValida = aplicarAcao(input);

    if (!acaoValida) {
      console.log('\n❌ Ação inválida.');
      return loopJogo();
    }

    // ⏳ AVANÇO DO TEMPO DO MUNDO (CRÍTICO NA SUA ARQUITETURA)
    estado.rodadaGlobal += 1;

    // Avança o mundo (CÉREBRO DO JOGO)
    estado = resolverRodadaCampanha(estado);

    loopJogo();
  });
}

console.log('🏚️ Iniciando campanha: Vila Abandonada (Goblins à espreita)...\n');
loopJogo();
