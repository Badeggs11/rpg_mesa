// 🧪 testeEncontrosPerigosos.js
// Valida que, com desafio ATIVO, o sistema pode registrar encontroPendente
// sem iniciar combate nem mudar estado além disso.

const criarEstadoCampanha = require('../engine/campanha/criarEstadoCampanha');
const sistemaEncontrosPerigosos = require('../engine/campanha/sistemas/sistemaEncontrosPerigosos');

const jogadores = [
  { id: 1, nome: 'Jake' },
  { id: 2, nome: 'Luna' },
];

function prepararEstado() {
  const estado = criarEstadoCampanha(jogadores, 'historia_teste');
  estado.rodadaGlobal = 20;

  estado.logMundo = [];
  estado.encontroPendente = null;

  // Desafio ativo (pressão ambiental já acionada)
  estado.eventoDramaticoAtivo = {
    id: 'desafio_sobrevivencia_20',
    tipo: 'evento_dinamico',
    categoria: 'desafio',
    rodada: 20,
    desafio: 'desafio_sobrevivencia',
    subtipo: 'ambiente_hostil',
    descricao: 'Condições hostis exigem adaptação.',
    opcional: true,
    origem: 'mundo_sistemico',
    estado: 'ativo',
  };

  return estado;
}

const estado = prepararEstado();

console.log('🎬 ESTADO INICIAL');
console.log('Rodada:', estado.rodadaGlobal);
console.log('Desafio:', estado.eventoDramaticoAtivo);
console.log('Encontro pendente (antes):', estado.encontroPendente);
console.log('-------------------------------------');

// Roda várias vezes para observar surgir (probabilístico)
for (let i = 1; i <= 10; i++) {
  sistemaEncontrosPerigosos(estado);

  if (estado.encontroPendente) {
    console.log(`✅ Encontro gerado na iteração ${i}:`);
    console.log(estado.encontroPendente);
    break;
  } else {
    console.log(`... iteração ${i}: nenhum encontro ainda`);
  }
}

console.log('\n📜 Últimos logs:');
console.log(estado.logMundo.slice(-5));

// Garante que não cria outro encontro se já existe um pendente
if (estado.encontroPendente) {
  const idAntes = estado.encontroPendente.id;
  sistemaEncontrosPerigosos(estado);
  const idDepois = estado.encontroPendente.id;

  console.log('\n🛡️ Anti-spam (não deve substituir encontro pendente):');
  console.log('ID antes:', idAntes);
  console.log('ID depois:', idDepois);
}
