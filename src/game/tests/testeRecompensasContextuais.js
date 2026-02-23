// 🧪 testeRecompensasContextuais.js
// Valida que recompensas contextuais são geradas quando um desafio está ATIVO
// e que NÃO duplica na mesma rodada.

const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const sistemaRecompensasContextuais = require('../engine/campanha/sistemas/sistemaRecompensasContextuais');

// 👥 Jogadores simulados
const jogadores = [
  { id: 1, nome: 'Jake' },
  { id: 2, nome: 'Luna' },
];

function prepararEstadoComDesafioAtivo() {
  const estado = criarEstadoCampanha(jogadores, 'historia_teste');

  estado.rodadaGlobal = 15;

  // Estruturas essenciais
  estado.logMundo = [];
  estado.recompensasPendentes = [];

  // 🌦 Tensão alta (não é obrigatório para este teste, mas deixa coerente)
  estado.reacaoMundo = {
    nivelTensaoGlobal: 6,
    ultimoClima: 'tenso',
    historicoTensoes: [],
  };

  // 🎯 Desafio ATIVO (pressão ambiental já acionada)
  estado.eventoDramaticoAtivo = {
    id: 'desafio_sobrevivencia_15',
    tipo: 'evento_dinamico',
    categoria: 'desafio',
    rodada: 15,
    desafio: 'desafio_sobrevivencia',
    subtipo: 'ambiente_hostil',
    descricao:
      'As condições do mundo se tornaram mais severas, exigindo adaptação dos aventureiros.',
    opcional: true,
    origem: 'mundo_sistemico',
    estado: 'ativo', // 🔥 isso é o gatilho do sistema de recompensas
  };

  return estado;
}

const estado = prepararEstadoComDesafioAtivo();

console.log('🎬 ESTADO INICIAL:');
console.log('Rodada:', estado.rodadaGlobal);
console.log('Desafio ativo:', estado.eventoDramaticoAtivo);
console.log('Recompensas (antes):', estado.recompensasPendentes);
console.log('-------------------------------------');

// 1) Primeira execução: deve gerar 1 recompensa
sistemaRecompensasContextuais(estado);

console.log('\n✅ APÓS 1ª EXECUÇÃO:');
console.log('Recompensas Pendentes:', estado.recompensasPendentes);
console.log('Últimos Logs:', estado.logMundo.slice(-3));

// 2) Segunda execução na mesma rodada: NÃO deve duplicar
sistemaRecompensasContextuais(estado);

console.log('\n🛡️ APÓS 2ª EXECUÇÃO (anti-duplicação):');
console.log('Recompensas Pendentes:', estado.recompensasPendentes);
console.log('Total de recompensas:', estado.recompensasPendentes.length);

const logsRecompensa = estado.logMundo.filter(
  l => l.tipo === 'recompensa_gerada'
);
console.log('Logs recompensa_gerada:', logsRecompensa.length);

// 3) Simula rodada seguinte: deve gerar outra recompensa (nova chave)
estado.rodadaGlobal += 1;
sistemaRecompensasContextuais(estado);

console.log('\n⏭️ APÓS RODADA SEGUINTE (nova recompensa esperada):');
console.log('Rodada:', estado.rodadaGlobal);
console.log('Total de recompensas:', estado.recompensasPendentes.length);
console.log('Última recompensa:', estado.recompensasPendentes.slice(-1)[0]);
console.log('Últimos Logs:', estado.logMundo.slice(-3));
