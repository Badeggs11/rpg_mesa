// ⚔️ sistemaEncontrosPerigosos.js
// Registra um encontro perigoso no estado quando a pressão ambiental está ativa.
// NÃO inicia combate, NÃO muda local, NÃO aplica dano.
// Apenas cria "encontroPendente" e logs semânticos.

function garantirEstruturas(estado) {
  if (!estado.logMundo) estado.logMundo = [];
  if (estado.encontroPendente === undefined) estado.encontroPendente = null;
}

function jaExisteEncontroPendente(estado) {
  return !!estado.encontroPendente;
}

function gerarIdEncontro(estado, desafioId) {
  return `encontro_${desafioId}_rodada_${estado.rodadaGlobal}`;
}

// Tabela simples (expandível por "world packs" depois)
function escolherTipoDeEncontro(desafio) {
  // Ambiente hostil tende a gerar emboscada/ameaça
  if (desafio.subtipo === 'ambiente_hostil') {
    return {
      tipo: 'emboscada',
      perigo: 'alto',
      descricao:
        'Movimentos suspeitos cercam a área. Algo está prestes a atacar.',
    };
  }

  // Outros subtipos (placeholder)
  return {
    tipo: 'ameaça',
    perigo: 'medio',
    descricao: 'O ambiente dá sinais de perigo iminente.',
  };
}

function sistemaEncontrosPerigosos(estado) {
  if (!estado) return estado;
  garantirEstruturas(estado);

  // Não cria novo encontro se já existe um pendente (jogador ainda não decidiu)
  if (jaExisteEncontroPendente(estado)) return estado;

  const desafio = estado.eventoDramaticoAtivo;
  if (!desafio) return estado;
  if (desafio.categoria !== 'desafio') return estado;

  // Só faz sentido se o desafio estiver realmente ativo (pressão ambiental rolando)
  if (desafio.estado !== 'ativo') return estado;

  // Chance simples (pode ficar por tensão depois)
  // Como o jogador pediu risco real, mas sem spam: 50% por rodada enquanto ativo.
  const chance = 0.5;
  const rolagem = Math.random();
  if (rolagem > chance) return estado;

  const dadosEncontro = escolherTipoDeEncontro(desafio);
  const encontroId = gerarIdEncontro(estado, desafio.id);

  estado.encontroPendente = {
    id: encontroId,
    rodada: estado.rodadaGlobal,
    desafioId: desafio.id,
    origem: 'pressao_ambiental',
    status: 'pendente', // aguardando decisão do jogador
    ...dadosEncontro,
    escolhas: ['lutar', 'fugir'], // UI usa isso para botões/teclas
  };

  estado.logMundo.push({
    tipo: 'encontro_perigoso',
    rodada: estado.rodadaGlobal,
    encontroId,
    desafioId: desafio.id,
    descricao: 'Um encontro perigoso surgiu. Lutar ou fugir?',
  });

  return estado;
}

module.exports = sistemaEncontrosPerigosos;
